// Constantes do front-end. Os LIMITES precisam ser iguais aos da API
// (be/config/constants.js): se um mudar, o outro muda junto.

// Chaves do localStorage: escritas aqui UMA vez, em vez de repetidas à mão.
export const STORAGE_KEYS = {
  TOKEN: 'musicvibe_token',
  USER: 'musicvibe_user'
};

// Tamanho de página dos feeds. A API aceita no máximo 50 (PAGINATION.MAX_LIMIT).
export const PAGE_SIZE = 12;

// Limites de validação dos formulários (espelho de VALIDATION e UPLOAD da API)
export const LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  BIO_MAX: 255,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
  COMMENT_MAX: 500,
  PLAYLIST_TITLE_MIN: 3,
  PLAYLIST_TITLE_MAX: 100,
  PLAYLIST_DESCRIPTION_MAX: 500,
  AUDIO_MAX_MB: 20,
  AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg'],
  COVER_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

// Busca: o mínimo precisa ser igual ao da API (SEARCH.MIN_LENGTH). DEBOUNCE_MS é o
// tempo de pausa na digitação antes de pesquisar.
export const SEARCH = {
  MIN_LENGTH: 2,
  DEBOUNCE_MS: 400
};

// Notificações: o sino pergunta o número de não lidas a cada POLL_MS (30 s: o aviso
// chega em até meio minuto sem sobrecarregar a API; a aba escondida não pergunta).
export const NOTIFICATIONS = {
  POLL_MS: 30000
};

// Texto de cada tipo de notificação (a chave é o type que a API guarda)
export const NOTIFICATION_TEXT = {
  like: 'curtiu a sua música',
  comment: 'comentou na sua música',
  follow: 'começou a seguir você'
};

// Motivos de denúncia: a API guarda a CHAVE (key); a tela mostra o RÓTULO (label).
// A ordem e as chaves são as mesmas da API (REPORT.REASONS).
export const REPORT_REASONS = [
  { key: 'inappropriate_content', label: 'Conteúdo impróprio' },
  { key: 'harassment', label: 'Assédio ou discurso de ódio' },
  { key: 'spam', label: 'Spam ou golpes' },
  { key: 'copyright', label: 'Violação de direitos autorais' },
  { key: 'other', label: 'Outro' }
];

// Filtros da lista de denúncias do painel (os value são os mesmos da API: ADMIN.REPORT_FILTERS)
export const REPORT_FILTERS = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'reviewed', label: 'Revisadas' },
  { value: 'all', label: 'Todas' }
];

// Quanto tempo cada tipo de toast fica na tela (milissegundos)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  INFO: 4000,
  ERROR: 6000
};

// Mensagens padrão (usadas quando a API não manda uma)
export const MESSAGES = {
  GENERIC_ERROR: 'Ocorreu um erro na requisição.',
  NETWORK_ERROR:
    'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente novamente.',
  UNEXPECTED_ERROR: 'Erro inesperado ao preparar a requisição.'
};
