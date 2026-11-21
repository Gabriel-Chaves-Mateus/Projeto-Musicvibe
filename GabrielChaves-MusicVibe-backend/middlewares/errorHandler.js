const { error } = require('./apiResponse');
const { removeUploadedFiles } = require('../utils/fileCleanup');

module.exports = (err, req, res, next) => {
  console.error(err);

  // Requisição falhou: arquivos que o Multer já gravou viram órfãos.
  removeUploadedFiles(req);

  // Erros do Multer (ex.: arquivo grande demais) são erro do cliente, não 500.
  const statusCode =
    err.status || (err.name === 'MulterError' ? 400 : 500);
  const errors = err.errors || [];

  return error(
    res,
    err.code === 'LIMIT_FILE_SIZE'
      ? 'Arquivo excede o tamanho máximo permitido.'
      : err.message || 'Ocorreu um erro inesperado.',
    statusCode,
    errors
  );
};