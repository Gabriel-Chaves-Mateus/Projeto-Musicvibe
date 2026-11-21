const multer = require('multer');
const path = require('path');
const { UPLOAD } = require('../config/constants');

const AUDIO_DIR = path.join(__dirname, '../public/uploads/songs/audio');
const COVER_DIR = path.join(__dirname, '../public/uploads/songs/covers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === 'audio' ? AUDIO_DIR : COVER_DIR);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
  }
});

// Cada campo tem seu próprio conjunto de tipos aceitos.
const fileFilter = (req, file, cb) => {
  const allowed =
    file.fieldname === 'audio' ? UPLOAD.AUDIO_TYPES : UPLOAD.COVER_TYPES;

  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  }

  const error = new Error(
    file.fieldname === 'audio'
      ? 'Formato de áudio inválido. Use MP3, WAV ou OGG.'
      : 'Formato de capa inválido. Use JPG, PNG ou WEBP.'
  );
  error.status = 400;
  cb(error, false);
};

// fields([...]): vários arquivos, cada um com seu nome de campo.
const songUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.AUDIO_MAX_SIZE }
}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);

// single('cover'): um arquivo só. Usado no PUT (só a capa pode ser trocada;
// para trocar o áudio, exclui-se a música e envia-se de novo).
const coverUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.COVER_MAX_SIZE }
}).single('cover');

module.exports = { songUpload, coverUpload };
