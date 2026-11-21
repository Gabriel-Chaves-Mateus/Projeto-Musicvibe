import api from './api';

export function getMyPlaylists() {
  return api.get('/my-playlists');
}

// Formulário: o erro aparece DENTRO do modal, não em toast (silent: true)
export function createPlaylist(data) {
  return api.post('/my-playlists', data, { silent: true });
}

export function getPlaylistById(id) {
  return api.get(`/playlists/${id}`);
}

export function deletePlaylist(id) {
  return api.delete(`/playlists/${id}`);
}

// o id da música vai no CORPO
export function addSongToPlaylist(playlistId, songId) {
  return api.post(`/playlists/${playlistId}/songs`, { songId });
}

// o id da música vai na URL
export function removeSongFromPlaylist(playlistId, songId) {
  return api.delete(`/playlists/${playlistId}/songs/${songId}`);
}

export function getPlaylistsStatusForSong(songId) {
  return api.get(`/songs/${songId}/playlists-status`);
}
