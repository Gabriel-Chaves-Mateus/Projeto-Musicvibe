const sequelize = require('../../config/database');
const { User, Song, Playlist, PlaylistSong } = require('../../config/associations');

const AUTHOR_ATTRIBUTES = ['id', 'username', 'fullName', 'profilePicture'];

const authorInclude = {
  model: User,
  as: 'author',
  attributes: AUTHOR_ATTRIBUTES
};

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Ordem dos erros nas rotas de escrita: 404 (não existe) → 403 (existe, mas
// não é sua). Quem não é dona nem fica sabendo mais do que "não pode".
async function findOwnedPlaylistOrFail(playlistId, userId, options = {}) {
  const playlist = await Playlist.findByPk(playlistId, options);

  if (!playlist) {
    throw httpError('Playlist não encontrada.', 404);
  }

  if (playlist.userId !== userId) {
    throw httpError('Você não tem permissão para alterar esta playlist.', 403);
  }

  return playlist;
}

async function createPlaylist(userId, { title, description, isPublic }) {
  return Playlist.create({
    userId,
    title,
    description: description || null,
    // só é pública se vier EXATAMENTE true (o texto "false" não vira verdadeiro)
    isPublic: isPublic === true
  });
}

// Da mais nova para a mais antiga. createdAt tem precisão de segundos: duas
// playlists criadas no mesmo segundo têm datas iguais, e o id decrescente desempata.
async function getUserPlaylists(userId) {
  return Playlist.findAll({
    where: { userId },
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });
}

// currentUserId é null para visitante. Comparar com `!== null` primeiro evita
// que visitante (undefined/null) case com algo.
async function getPlaylistById(playlistId, currentUserId = null) {
  const playlist = await Playlist.findByPk(playlistId, { include: authorInclude });

  if (!playlist) {
    throw httpError('Playlist não encontrada.', 404);
  }

  const isOwner = currentUserId !== null && playlist.userId === currentUserId;

  if (!playlist.isPublic && !isOwner) {
    throw httpError('Esta playlist é privada.', 403);
  }

  const rows = await PlaylistSong.findAll({
    where: { playlistId: playlist.id },
    include: [
      {
        model: Song,
        as: 'song',
        include: [authorInclude]
      }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });

  return { playlist, songs: rows.map((row) => row.song), isOwner };
}

async function addToPlaylist(userId, playlistId, songId) {
  await findOwnedPlaylistOrFail(playlistId, userId);

  const song = await Song.findByPk(songId, { attributes: ['id'] });

  if (!song) {
    throw httpError('Música não encontrada.', 404);
  }

  return sequelize.transaction(async (transaction) => {
    const [, created] = await PlaylistSong.findOrCreate({
      where: { playlistId, songId },
      transaction
    });

    const playlist = await Playlist.findByPk(playlistId, { transaction });

    // Idempotente: só conta quando a linha é NOVA. Repetir não muda nada.
    if (created) {
      await playlist.increment('songsCount', { transaction });
      await playlist.reload({ transaction });
    }

    return { added: created, songsCount: playlist.songsCount };
  });
}

async function removeFromPlaylist(userId, playlistId, songId) {
  await findOwnedPlaylistOrFail(playlistId, userId);

  return sequelize.transaction(async (transaction) => {
    // destroy devolve quantas linhas apagou: 0 = a música não estava lá
    const removedRows = await PlaylistSong.destroy({
      where: { playlistId, songId },
      transaction
    });

    if (removedRows === 0) {
      throw httpError('Esta música não está na playlist.', 404);
    }

    const playlist = await Playlist.findByPk(playlistId, { transaction });
    await playlist.decrement('songsCount', { transaction });
    await playlist.reload({ transaction });

    return { songsCount: playlist.songsCount };
  });
}

async function deletePlaylist(userId, playlistId) {
  const playlist = await findOwnedPlaylistOrFail(playlistId, userId);

  await sequelize.transaction(async (transaction) => {
    // Linhas da junção (FK) saem antes da playlist, na mesma transação.
    await PlaylistSong.destroy({ where: { playlistId: playlist.id }, transaction });
    await playlist.destroy({ transaction });
  });
}

// As minhas playlists + se cada uma contém a música (alimenta o modal "Salvar").
async function getPlaylistsStatusForSong(userId, songId) {
  const song = await Song.findByPk(songId, { attributes: ['id'] });

  if (!song) {
    throw httpError('Música não encontrada.', 404);
  }

  const playlists = await getUserPlaylists(userId);

  const rows = await PlaylistSong.findAll({
    where: { songId, playlistId: playlists.map((p) => p.id) },
    attributes: ['playlistId']
  });
  const containing = new Set(rows.map((row) => row.playlistId));

  return playlists.map((playlist) => ({
    id: playlist.id,
    title: playlist.title,
    isPublic: playlist.isPublic,
    songsCount: playlist.songsCount,
    hasSong: containing.has(playlist.id)
  }));
}

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
  getPlaylistsStatusForSong
};
