import api from './api';

export function getComments(songId) {
  return api.get(`/songs/${songId}/comments`);
}

export function createComment(songId, content) {
  return api.post(`/songs/${songId}/comments`, { content }, { silent: true });
}
