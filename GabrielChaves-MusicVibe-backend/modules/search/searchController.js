const searchService = require('./searchService');
const { success } = require('../../middlewares/apiResponse');
const { SEARCH } = require('../../config/constants');

// GET /api/search?q=...
exports.search = async (req, res) => {
  // ?q=ab&q=cd vira ARRAY e ?q[x]=1 vira objeto: só texto é aceito, o resto vira ''.
  const raw = typeof req.query.q === 'string' ? req.query.q : '';
  const query = raw.trim().slice(0, SEARCH.MAX_LENGTH);

  let results = { songs: [], users: [] };

  if (query.length >= SEARCH.MIN_LENGTH) {
    // await é obrigatório: sem ele, ...results espalharia uma Promise (listas somem, 200 mesmo assim)
    results = await searchService.globalSearch(query);
  }

  return success(res, { query, ...results });
};
