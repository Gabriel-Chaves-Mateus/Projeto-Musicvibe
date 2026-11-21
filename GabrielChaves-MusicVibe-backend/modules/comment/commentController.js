const commentService = require('./commentService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/songs/:songId/comments
exports.createComment = async (req, res) => {
  const comment = await commentService.createComment(
    req.user.id,
    req.params.songId,
    req.body.content
  );

  return success(res, comment, 'Comentário publicado.', 201);
};

// GET /api/songs/:songId/comments  (pública)
exports.getComments = async (req, res) => {
  const comments = await commentService.getComments(req.params.songId);

  return success(res, comments);
};
