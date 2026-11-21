const { User, Song, Notification } = require('../../config/associations');

// Só dados públicos de quem agiu: nunca password, email nem isAdmin.
const ACTOR_ATTRIBUTES = ['id', 'username', 'fullName', 'profilePicture'];

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Chamada DENTRO da transação da ação (curtir, comentar, seguir): o aviso nasce
// junto com a ação ou não nasce. O segundo argumento é obrigatório: sem ele a
// escrita sai da transação, espera o lock da outra e a requisição trava até
// "Lock wait timeout exceeded" (500).
// Ninguém é avisado das próprias ações.
async function createNotification({ userId, actorId, type, songId = null }, transaction) {
  if (userId === actorId) {
    return null;
  }

  return Notification.create({ userId, actorId, type, songId }, { transaction });
}

// Desfazer a ação (descurtir, deixar de seguir) apaga o aviso: os quatro dados no where.
async function removeNotification({ userId, actorId, type, songId = null }, transaction) {
  return Notification.destroy({
    where: { userId, actorId, type, songId },
    transaction
  });
}

async function getUserNotifications(userId, page, limit) {
  const offset = (page - 1) * limit;

  const { rows, count } = await Notification.findAndCountAll({
    where: { userId },
    include: [
      { model: User, as: 'Actor', attributes: ACTOR_ATTRIBUTES },
      { model: Song, as: 'song', attributes: ['id', 'title', 'cover'] }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });

  return {
    notifications: rows,
    page,
    limit,
    total: count,
    hasMore: offset + rows.length < count
  };
}

async function getUnreadCount(userId) {
  return Notification.count({ where: { userId, isRead: false } });
}

// 404 → 403 (a ordem de sempre). Idempotente: só escreve se ainda não estava lida.
async function markAsRead(id, userId) {
  const notification = await Notification.findByPk(id);

  if (!notification) {
    throw httpError('Notificação não encontrada.', 404);
  }

  if (notification.userId !== userId) {
    throw httpError('Você não tem permissão para alterar esta notificação.', 403);
  }

  if (!notification.isRead) {
    await notification.update({ isRead: true });
  }

  // O número é calculado DEPOIS de esperar a escrita terminar.
  const unreadCount = await getUnreadCount(userId);

  return { id: notification.id, isRead: true, unreadCount };
}

module.exports = {
  createNotification,
  removeNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead
};
