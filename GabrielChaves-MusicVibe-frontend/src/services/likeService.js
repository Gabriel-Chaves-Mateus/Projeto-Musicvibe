import api from './api';

export function toggleLike(songId) {
  return api.post(`/songs/${songId}/toggle-like`);
}

export function getLikeStatus(songId) {
  return api.get(`/songs/${songId}/like-status`);
}

export function getLikedSongs() {
  return api.get('/liked-songs');
}
