const fs = require('fs');

const songService = require('./songService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/songs
exports.createSong = async (req, res) => {
  const song = await songService.createSong(
    req.user.id,
    req.body,
    req.files
  );

  return success(res, song, 'Música enviada com sucesso!', 201);
};

// GET /api/songs/:id  (pública com optionalAuth)
exports.getSongDetails = async (req, res) => {
  const song = await songService.getSongDetails(
    req.params.id,
    req.user?.id
  );

  return success(res, song);
};

// GET /api/songs/:id/stream  (protegida) — suporta Range / 206
exports.streamSong = async (req, res) => {
  const { filePath, size, mimeType } = await songService.getSongAudioFile(
    req.params.id
  );

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', mimeType);

  const range = req.headers.range;

  if (!range) {
    res.setHeader('Content-Length', size);
    return fs.createReadStream(filePath).pipe(res);
  }

  // "bytes=0-1023", "bytes=500-" ou "bytes=-500" (últimos 500 bytes)
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  let start;
  let end;

  if (match && (match[1] || match[2])) {
    if (match[1]) {
      start = parseInt(match[1], 10);
      end = match[2] ? Math.min(parseInt(match[2], 10), size - 1) : size - 1;
    } else {
      start = Math.max(size - parseInt(match[2], 10), 0);
      end = size - 1;
    }
  }

  if (start === undefined || start > end || start >= size) {
    res.setHeader('Content-Range', `bytes */${size}`);
    return res.status(416).end();
  }

  res.status(206);
  res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
  res.setHeader('Content-Length', end - start + 1);

  return fs.createReadStream(filePath, { start, end }).pipe(res);
};

// GET /api/my-songs
exports.getMySongs = async (req, res) => {
  const songs = await songService.getMySongs(req.user.id);

  return success(res, songs);
};

// GET /api/songs/:id/edit
exports.getSongForEdit = async (req, res) => {
  const song = await songService.getSongForEdit(req.params.id, req.user.id);

  return success(res, song);
};

// PUT /api/songs/:id
exports.updateSong = async (req, res) => {
  const song = await songService.updateSong(
    req.params.id,
    req.user.id,
    req.body,
    req.file
  );

  return success(res, song, 'Música atualizada com sucesso!');
};

// DELETE /api/songs/:id
exports.deleteSong = async (req, res) => {
  await songService.deleteSong(req.params.id, req.user.id);

  return success(res, null, 'Música excluída com sucesso!');
};
