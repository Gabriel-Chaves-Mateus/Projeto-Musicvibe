const adminService = require('./adminService');
const songService = require('../song/songService');
const { parsePagination } = require('../../utils/pagination');
const { parseId } = require('../../utils/parseId');
const { success } = require('../../middlewares/apiResponse');
const { SEARCH } = require('../../config/constants');

// ?search=a&search=b chega como array: só texto vale; o resto vira "sem filtro".
function readSearch(query) {
  if (typeof query.search !== 'string') return '';

  return query.search.trim().slice(0, SEARCH.MAX_LENGTH);
}

exports.getDashboard = async (req, res) => {
  const stats = await adminService.getDashboardStats();

  return success(res, stats);
};

exports.getReports = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const status = req.query.status || 'pending';

  const result = await adminService.getReports(status, page, limit);

  return success(res, result);
};

exports.reviewReport = async (req, res) => {
  const id = parseId(req.params.id, 'denúncia');

  const result = await adminService.reviewReport(id);

  return success(res, result, 'Denúncia marcada como revisada.');
};

exports.getUsers = async (req, res) => {
  const { page, limit } = parsePagination(req.query);

  const result = await adminService.getUsers(readSearch(req.query), page, limit);

  return success(res, result);
};

exports.setUserBlocked = async (req, res) => {
  const targetId = parseId(req.params.id, 'usuário');

  const result = await adminService.setUserBlocked(targetId, req.body.isBlocked, req.user.id);

  return success(
    res,
    result,
    result.isBlocked ? 'Usuário bloqueado.' : 'Usuário desbloqueado.'
  );
};

exports.getSongs = async (req, res) => {
  const { page, limit } = parsePagination(req.query);

  const result = await adminService.getSongs(readSearch(req.query), page, limit);

  return success(res, result);
};

// Reaproveita o delete da Atividade 9/13/14 (transação, 5 tabelas, arquivos);
// o último argumento true só pula a checagem de dono.
exports.deleteSong = async (req, res) => {
  const id = parseId(req.params.id, 'música');

  await songService.deleteSong(id, req.user.id, true);

  return success(res, null, 'Música excluída pelo painel.');
};
