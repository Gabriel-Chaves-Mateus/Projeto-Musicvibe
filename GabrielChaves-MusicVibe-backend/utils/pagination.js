const { PAGINATION } = require('../config/constants');

// Converte um valor da query string em inteiro >= 1; senão, devolve o padrão.
// Number.parseInt('abc') é NaN, e NaN >= 1 é false: texto, vazio, zero e
// negativo caem todos no "senão" sem precisar de um if para cada caso.
// ATENÇÃO: é >= 1 (e não > 1), senão ?limit=1 viraria o valor padrão.
function toPositiveInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return number >= 1 ? number : fallback;
}

// Lê page e limit de req.query (sempre strings) e devolve números seguros:
// - valor inválido (abc, 0, -3, vazio) -> padrão;
// - limit acima do teto -> MAX_LIMIT (ninguém pede 100000 itens de uma vez).
function parsePagination(query) {
  const page = toPositiveInt(query.page, PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    toPositiveInt(query.limit, PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT
  );

  return { page, limit };
}

module.exports = { parsePagination };
