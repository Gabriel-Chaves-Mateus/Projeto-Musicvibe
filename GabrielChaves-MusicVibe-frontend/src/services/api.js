import axios from 'axios';

import { STORAGE_KEYS, MESSAGES } from '../config/constants';
import { useToast } from '../composables/useToast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição:
// adiciona o token JWT automaticamente, quando existir.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// Quem avisa o usuário quando algo falha:
//  - AÇÃO (POST/PUT/PATCH/DELETE: curtir, seguir, excluir...) -> toast, aqui;
//  - LEITURA (GET) -> a TELA mostra o erro onde os dados iam aparecer;
//  - FORMULÁRIO -> o próprio formulário mostra, junto aos campos; por isso os
//    services de formulário passam { silent: true } e o toast NÃO é disparado;
//  - 401 -> não é toast: a sessão acabou e o usuário é levado ao login.
// "Toast para todo erro" duplicaria avisos (toast + mensagem da tela) e
// piscaria erros de validação que pertencem ao campo.
function notifyIfNeeded(error, config, message) {
  const method = (config?.method || 'get').toLowerCase();
  const isAction = method !== 'get';

  if (!isAction || config?.silent || error.response?.status === 401) {
    return;
  }

  useToast().error(message);
}

// Interceptor de resposta:
// normaliza respostas e erros.
// Se receber 401, limpa a sessão e redireciona para o Login.
api.interceptors.response.use(
  (response) => response.data,

  (error) => {
    if (error.response) {
      const apiError = error.response.data;

      if (error.response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        if (window.location.pathname !== '/login') {
          const redirect =
            window.location.pathname +
            window.location.search;

          window.location.href =
            `/login?redirect=${encodeURIComponent(redirect)}`;
        }
      }

      const message = apiError?.message || MESSAGES.GENERIC_ERROR;

      notifyIfNeeded(error, error.config, message);

      return Promise.reject({
        message,

        errors:
          apiError?.errors || [],

        status:
          error.response.status
      });

    } else if (error.request) {
      notifyIfNeeded(error, error.config, MESSAGES.NETWORK_ERROR);

      return Promise.reject({
        message: MESSAGES.NETWORK_ERROR,

        errors: [],
        status: null
      });

    } else {
      notifyIfNeeded(error, error.config, MESSAGES.UNEXPECTED_ERROR);

      return Promise.reject({
        message: MESSAGES.UNEXPECTED_ERROR,

        errors: [],
        status: null
      });
    }
  }
);

export default api;
