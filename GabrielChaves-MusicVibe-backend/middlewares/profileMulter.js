const multer = require('multer');
const path = require('path');

const { UPLOAD } = require('../config/constants');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(
        __dirname,
        '../public/uploads/profiles'
      )
    );
  },

  filename: function (req, file, cb) {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      'Formato de imagem inválido.'
    );

    error.status = 400;

    cb(error, false);
  }
};

const profileUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.PROFILE_MAX_SIZE
  }
});

module.exports = profileUpload;