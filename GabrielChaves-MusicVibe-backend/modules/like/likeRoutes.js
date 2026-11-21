const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');
const asyncHandler = require('../../middlewares/asyncHandler');
const { songIdParamValidator } = require('./likeValidator');
const likeController = require('./likeController');

router.post(
  '/songs/:songId/toggle-like',
  isAuthenticated,
  songIdParamValidator,
  asyncHandler(likeController.toggleLike)
);

router.get(
  '/songs/:songId/like-status',
  optionalAuth,
  songIdParamValidator,
  asyncHandler(likeController.getLikeStatus)
);

router.get(
  '/liked-songs',
  isAuthenticated,
  asyncHandler(likeController.getLikedSongs)
);

module.exports = router;
