const likeService = require('./likeService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/songs/:songId/toggle-like
exports.toggleLike = async (req, res) => {
  const result = await likeService.toggleLike(req.user.id, req.params.songId);

  // 201 quando a curtida foi criada, 200 quando foi desfeita
  return success(
    res,
    result,
    result.liked ? 'Música curtida.' : 'Curtida removida.',
    result.liked ? 201 : 200
  );
};

// GET /api/songs/:songId/like-status  (optionalAuth)
exports.getLikeStatus = async (req, res) => {
  const status = await likeService.getLikeStatus(
    req.params.songId,
    req.user?.id
  );

  return success(res, status);
};

// GET /api/liked-songs
exports.getLikedSongs = async (req, res) => {
  const songs = await likeService.getLikedSongs(req.user.id);

  return success(res, songs);
};
