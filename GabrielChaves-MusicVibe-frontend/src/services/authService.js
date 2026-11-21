import api from './api';

export function register(payload) {
  return api.post('/register', payload, { silent: true });
}

export function login(payload) {
  return api.post('/login', payload, { silent: true });
}

// undefined (e não null) no corpo: com null o Axios envia o texto "null", que o
// express.json() recusa com 400 (e o erro aparecia no Console como falha de CORS).
export function logout() {
  return api.post('/logout', undefined, { silent: true });
}

export function getMyProfile() {
  return api.get('/profile/me');
}

export function updateProfile(formData) {
  return api.put(
    '/profile/me',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      silent: true
    }
  );
}

export function getPublicProfile(username) {
  return api.get(`/profile/${encodeURIComponent(username)}`);
}
