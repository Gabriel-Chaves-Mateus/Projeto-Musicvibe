const playlistService = require('./playlistService');
const { parseId } = require('../../utils/parseId');
const { success } = require('../../middlewares/apiResponse');

// GET /api/my-playlists
exports.getMyPlaylists = async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.user.id);

  return success(res, playlists);
};

// POST /api/my-playlists
exports.createPlaylist = async (req, res) => {
  const { title, description, isPublic } = req.body;

  const playlist = await playlistService.createPlaylist(req.user.id, {
    title,
    description,
    isPublic
  });

  return success(res, playlist, 'Playlist criada com sucesso.', 201);
};

// GET /api/playlists/:id   (pública; optionalAuth)
exports.getPlaylistDetails = async (req, res) => {
  const playlistId = parseId(req.params.id, 'playlist');
  const currentUserId = req.user ? req.user.id : null;

  const { playlist, songs, isOwner } = await playlistService.getPlaylistById(
    playlistId,
    currentUserId
  );

  return success(res, { ...playlist.toJSON(), songs, isOwner });
};

// DELETE /api/playlists/:id
exports.deletePlaylist = async (req, res) => {
  const playlistId = parseId(req.params.id, 'playlist');

  await playlistService.deletePlaylist(req.user.id, playlistId);

  return success(res, null, 'Playlist excluída com sucesso.');
};

// POST /api/playlists/:id/songs   corpo: { songId }
exports.addSong = async (req, res) => {
  const playlistId = parseId(req.params.id, 'playlist');
  const songId = parseId(req.body.songId, 'música');

  const result = await playlistService.addToPlaylist(req.user.id, playlistId, songId);

  return success(
    res,
    result,
    result.added ? 'Música adicionada à playlist.' : 'A música já estava na playlist.',
    result.added ? 201 : 200
  );
};

// DELETE /api/playlists/:id/songs/:songId
exports.removeSong = async (req, res) => {
  const playlistId = parseId(req.params.id, 'playlist');
  const songId = parseId(req.params.songId, 'música');

  const result = await playlistService.removeFromPlaylist(req.user.id, playlistId, songId);

  return success(res, result, 'Música removida da playlist.');
};

// GET /api/songs/:songId/playlists-status
exports.getPlaylistsStatus = async (req, res) => {
  const songId = parseId(req.params.songId, 'música');

  const status = await playlistService.getPlaylistsStatusForSong(req.user.id, songId);

  return success(res, status);
};
