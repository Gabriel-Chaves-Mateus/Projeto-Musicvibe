const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const notificationController = require('./notificationController');

router.get('/notifications', isAuthenticated, asyncHandler(notificationController.getNotifications));

// Antes de /notifications/:id/...: "unread-count" nunca pode ser lido como id.
router.get(
  '/notifications/unread-count',
  isAuthenticated,
  asyncHandler(notificationController.getUnreadCount)
);

router.patch(
  '/notifications/:id/read',
  isAuthenticated,
  asyncHandler(notificationController.markAsRead)
);

module.exports = router;
