const fs = require('fs');
const path = require('path');

const SONGS_DIR = path.join(__dirname, '../public/uploads/songs');

// Apaga arquivos gravados pelo Multer (req.file / req.files) quando a
// requisição falhou: sem isso, ficam arquivos órfãos no disco.
function removeUploadedFiles(req) {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (req.files) {
    files.push(...Object.values(req.files).flat());
  }

  files.forEach((file) => fs.unlink(file.path, () => {}));
}

// Apaga um arquivo de música/capa já existente. Falha silenciosa:
// o banco já foi atualizado, e um arquivo que não existe não é erro.
function deleteSongFile(kind, filename) {
  if (!filename) {
    return;
  }

  fs.unlink(path.join(SONGS_DIR, kind, filename), () => {});
}

module.exports = { removeUploadedFiles, deleteSongFile };
