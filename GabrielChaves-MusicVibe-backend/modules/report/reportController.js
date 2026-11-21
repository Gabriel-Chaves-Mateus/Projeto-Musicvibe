const reportService = require('./reportService');
const { parseId } = require('../../utils/parseId');
const { success } = require('../../middlewares/apiResponse');

// POST /api/songs/:songId/report   corpo: { reason }
exports.reportSong = async (req, res) => {
  const songId = parseId(req.params.songId, 'música');

  const report = await reportService.reportSong(req.user.id, songId, req.body.reason);

  return success(res, report, 'Denúncia enviada. Obrigado por avisar.', 201);
};
