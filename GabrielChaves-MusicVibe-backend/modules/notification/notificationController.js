const notificationService = require('./notificationService');
const { parsePagination } = require('../../utils/pagination');
const { parseId } = require('../../utils/parseId');
const { success } = require('../../middlewares/apiResponse');

// GET /api/notifications?page=&limit=
exports.getNotifications = async (req, res) => {
  const { page, limit } = parsePagination(req.query);

  const result = await notificationService.getUserNotifications(req.user.id, page, limit);

  return success(res, result);
};

// GET /api/notifications/unread-count
exports.getUnreadCount = async (req, res) => {
  const unreadCount = await notificationService.getUnreadCount(req.user.id);

  return success(res, { unreadCount });
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  const id = parseId(req.params.id, 'notificação');

  const result = await notificationService.markAsRead(id, req.user.id);

  return success(res, result, 'Notificação marcada como lida.');
};
