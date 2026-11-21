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

exports.songIdParamValidator = [
  param('songId')
    .isInt({ min: 1 })
    .withMessage('O id da música deve ser um número inteiro positivo.'),

  validate
];

exports.createCommentValidator = [
  param('songId')
    .isInt({ min: 1 })
    .withMessage('O id da música deve ser um número inteiro positivo.'),

  // trim() ANTES de notEmpty(): "   " vira "" e aí sim é recusado.
  // Na ordem inversa, "   " passaria no notEmpty().
  body('content')
    .trim()
    .notEmpty()
    .withMessage('O comentário não pode ficar vazio.')
    .bail()
    .isLength({ max: VALIDATION.COMMENT_MAX })
    .withMessage(
      `O comentário deve ter no máximo ${VALIDATION.COMMENT_MAX} caracteres.`
    ),

  validate
];
