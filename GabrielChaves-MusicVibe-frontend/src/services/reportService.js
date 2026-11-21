import api from './api';

// Formulário: o erro (inclusive o 409 "já denunciou") aparece DENTRO do modal (silent: true)
export function reportSong(songId, reason) {
  return api.post(`/songs/${songId}/report`, { reason }, { silent: true });
}
