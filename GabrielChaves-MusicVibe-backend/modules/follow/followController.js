const followService = require('./followService');
const songService = require('../song/songService');
const { parsePagination } = require('../../utils/pagination');
const { parseId } = require('../../utils/parseId');
const { success } = require('../../middlewares/apiResponse');

// POST /api/users/:userId/toggle-follow
exports.toggleFollow = async (req, res) => {
  const result = await followService.toggleFollow(req.user.id, parseId(req.params.userId, 'usuário'));

  // 201 quando passou a seguir, 200 quando deixou de seguir
  return success(
    res,
    result,
    result.isFollowing ? 'Agora você segue esta pessoa.' : 'Você deixou de seguir esta pessoa.',
    result.isFollowing ? 201 : 200
  );
};

// GET /api/users/:userId/follow-status
exports.getFollowStatus = async (req, res) => {
  const status = await followService.getFollowStatus(req.user.id, parseId(req.params.userId, 'usuário'));

  return success(res, status);
};

// GET /api/users/:userId/followers
exports.getFollowers = async (req, res) => {
  const people = await followService.getFollowers(parseId(req.params.userId, 'usuário'));

  return success(res, people);
};

// GET /api/users/:userId/following
exports.getFollowing = async (req, res) => {
  const people = await followService.getFollowing(parseId(req.params.userId, 'usuário'));

  return success(res, people);
};

// GET /api/following-songs?page=1&limit=12
exports.getFollowingSongs = async (req, res) => {
  const { page, limit } = parsePagination(req.query);

  const feed = await songService.getFollowingSongs(req.user.id, page, limit);

  return success(res, feed);
};
