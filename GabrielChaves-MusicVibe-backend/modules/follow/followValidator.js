const { param, validationResult } = require('express-validator');

exports.userIdParamValidator = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('O id do usuário deve ser um número inteiro positivo.'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const error = new Error(errors.array()[0].msg);
    error.status = 400;
    error.errors = errors.array();

    throw error;
  }
];
