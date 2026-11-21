const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');
const { songUpload, coverUpload } = require('../../middlewares/songMulter');
const asyncHandler = require('../../middlewares/asyncHandler');
const {
  createSongValidator,
  updateSongValidator,
  songIdValidator
} = require('./songValidator');
const songController = require('./songController');

// Ordem: auth → multer → validator → controller
router.post(
  '/songs',
  isAuthenticated,
  songUpload,
  createSongValidator,
  asyncHandler(songController.createSong)
);

// Músicas do usuário logado, da mais nova para a mais antiga
router.get(
  '/my-songs',
  isAuthenticated,
  asyncHandler(songController.getMySongs)
);

// Pública, mas tenta identificar quem pede (para o isOwner)
router.get(
  '/songs/:id',
  optionalAuth,
  songIdValidator,
  asyncHandler(songController.getSongDetails)
);

// Protegida: <audio> não consegue enviar Authorization, então o
// player do front NÃO usa esta rota (usa o arquivo estático em /uploads).
router.get(
  '/songs/:id/stream',
  isAuthenticated,
  songIdValidator,
  asyncHandler(songController.streamSong)
);

// Dados para pré-preencher o formulário de edição (só o dono)
router.get(
  '/songs/:id/edit',
  isAuthenticated,
  songIdValidator,
  asyncHandler(songController.getSongForEdit)
);

// Ordem: auth → multer → validator → controller
router.put(
  '/songs/:id',
  isAuthenticated,
  coverUpload,
  updateSongValidator,
  asyncHandler(songController.updateSong)
);

router.delete(
  '/songs/:id',
  isAuthenticated,
  songIdValidator,
  asyncHandler(songController.deleteSong)
);

module.exports = router;
