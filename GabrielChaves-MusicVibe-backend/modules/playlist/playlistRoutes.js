const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');
const asyncHandler = require('../../middlewares/asyncHandler');
const { createPlaylistValidator } = require('./playlistValidator');
const playlistController = require('./playlistController');

router.get('/my-playlists', isAuthenticated, asyncHandler(playlistController.getMyPlaylists));

router.post(
  '/my-playlists',
  isAuthenticated,
  createPlaylistValidator,
  asyncHandler(playlistController.createPlaylist)
);

// Única rota pública: playlist pública pode ser vista por qualquer pessoa.
router.get('/playlists/:id', optionalAuth, asyncHandler(playlistController.getPlaylistDetails));

router.delete('/playlists/:id', isAuthenticated, asyncHandler(playlistController.deletePlaylist));

router.post('/playlists/:id/songs', isAuthenticated, asyncHandler(playlistController.addSong));

router.delete(
  '/playlists/:id/songs/:songId',
  isAuthenticated,
  asyncHandler(playlistController.removeSong)
);

router.get(
  '/songs/:songId/playlists-status',
  isAuthenticated,
  asyncHandler(playlistController.getPlaylistsStatus)
);

module.exports = router;
