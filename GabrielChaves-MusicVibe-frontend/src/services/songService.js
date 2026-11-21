import api from './api';

import { PAGE_SIZE } from '../config/constants';

// onUploadProgress é recebido como parâmetro: o service não conhece a tela,
// quem decide o que fazer com o progresso é quem chama.
export function createSong(formData, onUploadProgress) {
  return api.post('/songs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress,
    silent: true
  });
}

export function getFeed(page = 1, limit = PAGE_SIZE) {
  return api.get('/feed', { params: { page, limit } });
}

export function getSongById(id) {
  return api.get(`/songs/${id}`);
}

export function getMySongs() {
  return api.get('/my-songs');
}

export function getSongForEdit(id) {
  return api.get(`/songs/${id}/edit`);
}

export function updateSong(id, formData) {
  return api.put(`/songs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    silent: true
  });
}

export function deleteSong(id) {
  return api.delete(`/songs/${id}`);
}
