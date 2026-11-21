const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const {
  songIdParamValidator,
  createCommentValidator
} = require('./commentValidator');
const commentController = require('./commentController');

router.post(
  '/songs/:songId/comments',
  isAuthenticated,
  createCommentValidator,
  asyncHandler(commentController.createComment)
);

router.get(
  '/songs/:songId/comments',
  songIdParamValidator,
  asyncHandler(commentController.getComments)
);

module.exports = router;
