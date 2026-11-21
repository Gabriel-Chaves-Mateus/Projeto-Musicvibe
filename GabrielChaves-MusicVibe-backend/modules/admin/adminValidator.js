const { query, body, validationResult } = require('express-validator');
const { ADMIN } = require('../../config/constants');

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

exports.reportsFilterValidator = [
  query('status')
    .optional()
    .isIn(ADMIN.REPORT_FILTERS)
    .withMessage('Filtro inválido. Use pending, reviewed ou all.'),

  validate
];

// strict: só o BOOLEANO true/false passa; o texto "true" é recusado.
exports.blockUserValidator = [
  body('isBlocked')
    .exists()
    .withMessage('Informe isBlocked (true ou false).')
    .bail()
    .isBoolean({ strict: true })
    .withMessage('isBlocked deve ser true ou false (booleano).'),

  validate
];
