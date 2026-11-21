const sequelize = require('../../config/database');
const { User, Follow } = require('../../config/associations');
const { NOTIFICATION } = require('../../config/constants');
const { createNotification, removeNotification } = require('../notification/notificationService');

const PERSON_ATTRIBUTES = ['id', 'username', 'fullName', 'bio', 'profilePicture'];

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Ordem dos parâmetros SEMPRE (followerId, followingId): "quem segue, quem é seguido".
// Os dois são números: trocar a ordem não dá erro nenhum, só relações invertidas.
async function toggleFollow(followerId, followingId) {
  // 400 antes de qualquer consulta: não existe "seguir a si mesmo".
  // (Só funciona porque o controller já converteu o id para número.)
  if (followerId === followingId) {
    throw httpError('Você não pode seguir a si mesmo.', 400);
  }

  return sequelize.transaction(async (transaction) => {
    const target = await User.findByPk(followingId, { transaction });

    if (!target) {
      throw httpError('Usuário não encontrado.', 404);
    }

    const [, created] = await Follow.findOrCreate({
      where: { followerId, followingId },
      transaction
    });

    // Quatro escritas, uma transação: a linha de Follow, os DOIS contadores e o aviso.
    // followersCount sobe em quem É SEGUIDO; followingCount, em quem SEGUE.
    if (created) {
      await User.increment('followersCount', { where: { id: followingId }, transaction });
      await User.increment('followingCount', { where: { id: followerId }, transaction });
      await createNotification(
        { userId: followingId, actorId: followerId, type: NOTIFICATION.TYPES.FOLLOW },
        transaction
      );
    } else {
      await Follow.destroy({ where: { followerId, followingId }, transaction });
      await User.decrement('followersCount', { where: { id: followingId }, transaction });
      await User.decrement('followingCount', { where: { id: followerId }, transaction });
      await removeNotification(
        { userId: followingId, actorId: followerId, type: NOTIFICATION.TYPES.FOLLOW },
        transaction
      );
    }

    await target.reload({ transaction });

    return { isFollowing: created, followersCount: target.followersCount };
  });
}

async function getFollowStatus(followerId, followingId) {
  const target = await User.findByPk(followingId, { attributes: ['id', 'followersCount'] });

  if (!target) {
    throw httpError('Usuário não encontrado.', 404);
  }

  const follow = await Follow.findOne({ where: { followerId, followingId } });

  return { isFollowing: !!follow, followersCount: target.followersCount };
}

async function ensureUserExists(userId) {
  const user = await User.findByPk(userId, { attributes: ['id'] });

  if (!user) {
    throw httpError('Usuário não encontrado.', 404);
  }
}

// "Quem segue o usuário X?" → linhas onde followingId = X; a PESSOA que
// interessa é o Follower (quem segue). Mais recentes primeiro.
async function getFollowers(userId) {
  await ensureUserExists(userId);

  const rows = await Follow.findAll({
    where: { followingId: userId },
    include: [{ model: User, as: 'Follower', attributes: PERSON_ATTRIBUTES }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });

  return rows.map((row) => row.Follower);
}

// "Quem o usuário X segue?" → linhas onde followerId = X; a PESSOA que
// interessa é o Following (quem é seguido).
async function getFollowing(userId) {
  await ensureUserExists(userId);

  const rows = await Follow.findAll({
    where: { followerId: userId },
    include: [{ model: User, as: 'Following', attributes: PERSON_ATTRIBUTES }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });

  return rows.map((row) => row.Following);
}

module.exports = { toggleFollow, getFollowStatus, getFollowers, getFollowing };
