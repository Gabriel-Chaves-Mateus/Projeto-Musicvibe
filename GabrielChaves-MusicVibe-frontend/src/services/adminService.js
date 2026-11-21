import api from './api';

// Sem { silent: true }: nas ações do painel, quem avisa o erro é o interceptor (toast).
export function getAdminDashboard() {
  return api.get('/admin/dashboard');
}

export function getAdminReports(status, page = 1, limit) {
  return api.get('/admin/reports', { params: { status, page, limit } });
}

// Sem segundo argumento: nunca null (o Axios mandaria o texto "null" e o express.json() recusaria).
export function reviewAdminReport(id) {
  return api.patch(`/admin/reports/${id}/review`);
}

export function getAdminUsers(search, page = 1, limit) {
  return api.get('/admin/users', { params: { search, page, limit } });
}

export function setUserBlocked(id, isBlocked) {
  return api.patch(`/admin/users/${id}/block`, { isBlocked });
}

export function getAdminSongs(search, page = 1, limit) {
  return api.get('/admin/songs', { params: { search, page, limit } });
}

export function deleteAdminSong(id) {
  return api.delete(`/admin/songs/${id}`);
}
