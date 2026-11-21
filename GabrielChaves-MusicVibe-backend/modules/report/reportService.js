const { Song, Report } = require('../../config/associations');

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Uma escrita só: sem transação. Não notifica o dono (denúncia é para a moderação).
// Ordem: existe? (404) → é meu? (400) → já denunciei? (409).
async function reportSong(userId, songId, reason) {
  const song = await Song.findByPk(songId, { attributes: ['id', 'userId'] });

  if (!song) {
    throw httpError('Música não encontrada.', 404);
  }

  if (song.userId === userId) {
    throw httpError('Você não pode denunciar a sua própria música.', 400);
  }

  // O índice único (user_id, song_id) garante o 409 mesmo com dois cliques
  // simultâneos: o findOrCreate trata a violação e devolve created=false.
  const [report, created] = await Report.findOrCreate({
    where: { userId, songId },
    defaults: { reason }
  });

  if (!created) {
    throw httpError('Você já denunciou esta música.', 409);
  }

  return { id: report.id, songId: report.songId, reason: report.reason };
}

module.exports = { reportSong };
