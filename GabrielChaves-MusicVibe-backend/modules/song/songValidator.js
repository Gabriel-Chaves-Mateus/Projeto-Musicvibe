const { body, param, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error(errors.array()[0].msg);
  error.status = 400;
  error.errors = errors.array();

  throw error;
};

exports.createSongValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('O título é obrigatório.')
    .bail()
    .isLength({ max: VALIDATION.TITLE_MAX })
    .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: VALIDATION.DESCRIPTION_MAX })
    .withMessage(
      `A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`
    ),

  body('audio').custom((value, { req }) => {
    if (!req.files?.audio?.[0]) {
      throw new Error('O arquivo de áudio é obrigatório.');
    }
    return true;
  }),

  body('cover').custom((value, { req }) => {
    if (!req.files?.cover?.[0]) {
      throw new Error('A imagem de capa é obrigatória.');
    }
    return true;
  }),

  validate
];

exports.songIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('O id da música deve ser um número inteiro positivo.'),

  validate
];

// PUT: título e descrição; a capa é opcional (multer.single já rodou antes)
exports.updateSongValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('O id da música deve ser um número inteiro positivo.'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('O título é obrigatório.')
    .bail()
    .isLength({ max: VALIDATION.TITLE_MAX })
    .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: VALIDATION.DESCRIPTION_MAX })
    .withMessage(
      `A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`
    ),

  validate
];
