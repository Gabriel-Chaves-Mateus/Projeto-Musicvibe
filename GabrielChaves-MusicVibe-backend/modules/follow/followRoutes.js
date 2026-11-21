const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const { userIdParamValidator } = require('./followValidator');
const followController = require('./followController');

router.post(
  '/users/:userId/toggle-follow',
  isAuthenticated,
  userIdParamValidator,
  asyncHandler(followController.toggleFollow)
);

router.get(
  '/users/:userId/follow-status',
  isAuthenticated,
  userIdParamValidator,
  asyncHandler(followController.getFollowStatus)
);

// Listas públicas: qualquer pessoa pode ver quem segue quem.
router.get(
  '/users/:userId/followers',
  userIdParamValidator,
  asyncHandler(followController.getFollowers)
);

router.get(
  '/users/:userId/following',
  userIdParamValidator,
  asyncHandler(followController.getFollowing)
);

router.get(
  '/following-songs',
  isAuthenticated,
  asyncHandler(followController.getFollowingSongs)
);

module.exports = router;
