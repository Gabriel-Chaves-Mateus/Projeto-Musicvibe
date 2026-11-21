const { body, validationResult } = require('express-validator');
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

exports.createPlaylistValidator = [
  // trim() ANTES de notEmpty(): "   " vira "" e é recusado.
  body('title')
    .trim()
    .notEmpty()
    .withMessage('O título da playlist é obrigatório.')
    .bail()
    .isLength({
      min: VALIDATION.PLAYLIST_TITLE_MIN,
      max: VALIDATION.PLAYLIST_TITLE_MAX
    })
    .withMessage(
      `O título deve ter entre ${VALIDATION.PLAYLIST_TITLE_MIN} e ${VALIDATION.PLAYLIST_TITLE_MAX} caracteres.`
    ),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: VALIDATION.PLAYLIST_DESCRIPTION_MAX })
    .withMessage(
      `A descrição deve ter no máximo ${VALIDATION.PLAYLIST_DESCRIPTION_MAX} caracteres.`
    ),

  // strict: só o booleano true/false de verdade; "sim" e "false" (texto) são recusados.
  body('isPublic')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('isPublic deve ser true ou false.'),

  validate
];
