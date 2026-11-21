const sequelize = require('../../config/database');
const { User, Song, Like } = require('../../config/associations');
const { NOTIFICATION } = require('../../config/constants');
const { createNotification, removeNotification } = require('../notification/notificationService');

const AUTHOR_ATTRIBUTES = ['id', 'username', 'fullName', 'profilePicture'];

function songNotFound() {
  const error = new Error('Música não encontrada.');
  error.status = 404;
  return error;
}

// Ordem dos parâmetros SEMPRE (userId, songId): são dois números, então
// trocar a ordem não dá erro nenhum, só curtidas trocadas.
async function toggleLike(userId, songId) {
  // Linha de Like + contador da música + aviso para o dono: as três escritas
  // ficam na MESMA transação (todos os comandos recebem { transaction }).
  return sequelize.transaction(async (transaction) => {
    const song = await Song.findByPk(songId, { transaction });

    if (!song) {
      throw songNotFound();
    }

    const existing = await Like.findOne({
      where: { userId, songId },
      transaction
    });

    let liked;

    if (existing) {
      await existing.destroy({ transaction });
      await song.decrement('likesCount', { transaction });
      // Descurtir apaga o aviso: o evento "curtiu" deixou de ser verdade.
      await removeNotification(
        { userId: song.userId, actorId: userId, type: NOTIFICATION.TYPES.LIKE, songId: song.id },
        transaction
      );
      liked = false;
    } else {
      await Like.create({ userId, songId }, { transaction });
      await song.increment('likesCount', { transaction });
      await createNotification(
        { userId: song.userId, actorId: userId, type: NOTIFICATION.TYPES.LIKE, songId: song.id },
        transaction
      );
      liked = true;
    }

    await song.reload({ transaction });

    return { liked, likesCount: song.likesCount };
  });
}

// viewerId pode ser undefined (visitante): nesse caso liked é sempre false.
async function getLikeStatus(songId, viewerId) {
  const song = await Song.findByPk(songId, {
    attributes: ['id', 'likesCount']
  });

  if (!song) {
    throw songNotFound();
  }

  const like = viewerId
    ? await Like.findOne({ where: { userId: viewerId, songId } })
    : null;

  return { liked: !!like, likesCount: song.likesCount };
}

// Músicas curtidas pelo usuário, da curtida mais recente para a mais antiga
async function getLikedSongs(userId) {
  return Song.findAll({
    include: [
      { model: User, as: 'author', attributes: AUTHOR_ATTRIBUTES },
      {
        model: Like,
        as: 'likes',
        where: { userId },
        attributes: [],
        required: true
      }
    ],
    order: [[{ model: Like, as: 'likes' }, 'createdAt', 'DESC']]
  });
}

module.exports = { toggleLike, getLikeStatus, getLikedSongs };
