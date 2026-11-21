const fs = require('fs');
const path = require('path');

const sequelize = require('../../config/database');
const { Op } = require('sequelize');
const { User, Song, Like, Comment, Follow, Playlist, PlaylistSong, Notification, Report } = require('../../config/associations');
const { UPLOAD, PAGINATION } = require('../../config/constants');
const { deleteSongFile } = require('../../utils/fileCleanup');

const AUDIO_DIR = path.join(__dirname, '../../public/uploads/songs/audio');

// Só estes campos do autor saem na resposta: nunca a senha nem o e-mail.
const AUTHOR_ATTRIBUTES = ['id', 'username', 'fullName', 'profilePicture'];

const authorInclude = {
  model: User,
  as: 'author',
  attributes: AUTHOR_ATTRIBUTES
};

function forbidden() {
  const error = new Error('Você não tem permissão para alterar esta música.');
  error.status = 403;
  return error;
}

function notFound() {
  const error = new Error('Música não encontrada.');
  error.status = 404;
  return error;
}

async function createSong(userId, data, files) {
  // Transação: ou cria a música E incrementa o contador, ou nenhum dos dois.
  // Se falhar, o errorHandler apaga os arquivos que o Multer já gravou.
  return sequelize.transaction(async (transaction) => {
    const song = await Song.create(
      {
        title: data.title,
        description: data.description || null,
        audio: files.audio[0].filename,
        cover: files.cover[0].filename,
        userId
      },
      { transaction }
    );

    await User.increment('songsCount', {
      by: 1,
      where: { id: userId },
      transaction
    });

    return song;
  });
}

// viewerId vem do optionalAuth: pode ser undefined (visitante).
async function getSongDetails(songId, viewerId) {
  const song = await Song.findByPk(songId, { include: authorInclude });

  if (!song) {
    throw notFound();
  }

  // Incremento atômico no banco (evita perder contagem em acessos simultâneos)
  await song.increment('playsCount');
  await song.reload();

  const like = viewerId
    ? await Like.findOne({ where: { userId: viewerId, songId: song.id } })
    : null;

  return {
    ...song.toJSON(),
    isOwner: !!viewerId && song.userId === viewerId,
    isLiked: !!like
  };
}

// offset = (page - 1) * limit: converte "página" em "quantos registros pular".
async function getFeedSongs(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) {
  const offset = (page - 1) * limit;

  const { rows, count } = await Song.findAndCountAll({
    include: authorInclude,
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });

  return {
    songs: rows,
    page,
    limit,
    total: count,
    hasMore: offset + rows.length < count
  };
}

// Feed de quem o usuário segue: mesma estrutura do feed geral, filtrada pelos
// autores que ele segue (WHERE user_id IN (...)).
async function getFollowingSongs(userId, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) {
  const rows = await Follow.findAll({
    where: { followerId: userId },
    attributes: ['followingId']
  });
  const followedIds = rows.map((row) => row.followingId);

  // Quem não segue ninguém: devolve vazio cedo. Sem isso, IN () com lista
  // vazia vira SQL inválido/sem sentido e gasta uma consulta à toa.
  if (followedIds.length === 0) {
    return { songs: [], page, limit, total: 0, hasMore: false };
  }

  const offset = (page - 1) * limit;

  const { rows: songs, count } = await Song.findAndCountAll({
    where: { userId: { [Op.in]: followedIds } },
    include: authorInclude,
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });

  return {
    songs,
    page,
    limit,
    total: count,
    hasMore: offset + songs.length < count
  };
}

// Dados do arquivo de áudio para a rota /stream
async function getSongAudioFile(songId) {
  const song = await Song.findByPk(songId, { attributes: ['id', 'audio'] });

  if (!song) {
    throw notFound();
  }

  const filePath = path.join(AUDIO_DIR, song.audio);

  if (!fs.existsSync(filePath)) {
    throw notFound();
  }

  const ext = path.extname(song.audio).toLowerCase();

  return {
    filePath,
    size: fs.statSync(filePath).size,
    mimeType: UPLOAD.AUDIO_MIME_BY_EXT[ext] || 'application/octet-stream'
  };
}

// 404 ANTES de 403: primeiro "existe?", depois "é seu?". Se a ordem fosse
// invertida, não daria para distinguir "não existe" de "existe, mas é de outro".
async function findSongOrFail(songId) {
  const song = await Song.findByPk(songId);

  if (!song) {
    throw notFound();
  }

  return song;
}

async function findOwnedSong(songId, userId) {
  const song = await Song.findByPk(songId);

  if (!song) {
    throw notFound();
  }

  if (song.userId !== userId) {
    throw forbidden();
  }

  return song;
}

async function getMySongs(userId) {
  return Song.findAll({
    where: { userId },
    include: authorInclude,
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });
}

// Não incrementa playsCount: abrir o formulário de edição não é reprodução.
async function getSongForEdit(songId, userId) {
  const song = await findOwnedSong(songId, userId);

  return {
    id: song.id,
    title: song.title,
    description: song.description,
    cover: song.cover,
    audio: song.audio
  };
}

async function updateSong(songId, userId, data, coverFile) {
  const song = await findOwnedSong(songId, userId);

  const oldCover = song.cover;

  song.title = data.title;
  song.description = data.description || null;

  if (coverFile) {
    song.cover = coverFile.filename;
  }

  // 1º banco, 2º disco. Se o save falhar, a capa antiga continua no disco
  // e o registro continua apontando para ela. Na ordem inversa, o registro
  // poderia apontar para um arquivo que já foi apagado.
  await song.save();

  if (coverFile) {
    deleteSongFile('covers', oldCover);
  }

  return song;
}

// isAdmin = true (rota do painel): pula a checagem de dono, mas o resto é o MESMO caminho
// (as cinco tabelas, a transação, o arquivo no disco). Não existe segunda forma de excluir.
async function deleteSong(songId, userId, isAdmin = false) {
  const song = isAdmin ? await findSongOrFail(songId) : await findOwnedSong(songId, userId);

  const { audio, cover } = song;

  await sequelize.transaction(async (transaction) => {
    // Curtidas e comentários dependem da música (FK): saem primeiro,
    // na mesma transação, para não sobrar linha órfã nem violar a FK.
    // Filhas antes do pai: denúncias (FK NO ACTION: sem isto a exclusão dá 500)
    // e notificações do item (FK SET NULL: sem isto sobram avisos órfãos).
    await Report.destroy({ where: { songId: song.id }, transaction });
    await Notification.destroy({ where: { songId: song.id }, transaction });

    await Like.destroy({ where: { songId: song.id }, transaction });
    await Comment.destroy({ where: { songId: song.id }, transaction });

    // Playlists: o ON DELETE CASCADE do banco apagaria as linhas da junção,
    // mas NÃO atualiza o songsCount de cada playlist (o banco não sabe que
    // esse contador existe). Por isso o código desconta 1 de cada playlist
    // afetada e só então apaga as linhas.
    const playlistRows = await PlaylistSong.findAll({
      where: { songId: song.id },
      transaction
    });

    for (const row of playlistRows) {
      await Playlist.decrement('songsCount', {
        by: 1,
        where: { id: row.playlistId },
        transaction
      });
    }

    await PlaylistSong.destroy({ where: { songId: song.id }, transaction });

    await song.destroy({ transaction });

    // O contador é de quem É DONO do item (com o administrador excluindo, não é o dele).
    await User.increment('songsCount', {
      by: -1,
      where: { id: song.userId },
      transaction
    });
  });

  // Só depois do commit os arquivos saem do disco.
  deleteSongFile('audio', audio);
  deleteSongFile('covers', cover);
}

module.exports = {
  getMySongs,
  getSongForEdit,
  updateSong,
  deleteSong,
  createSong,
  getSongDetails,
  getFeedSongs,
  getFollowingSongs,
  getSongAudioFile
};
