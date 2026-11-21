module.exports = {
  VALIDATION: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 6,
    BIO_MAX: 255,
    TITLE_MAX: 100,
    DESCRIPTION_MAX: 500,
    COMMENT_MAX: 500,
    PLAYLIST_TITLE_MIN: 3,
    PLAYLIST_TITLE_MAX: 100,
    PLAYLIST_DESCRIPTION_MAX: 500
  },

  NOTIFICATION: {
    TYPES: {
      LIKE: 'like',
      COMMENT: 'comment',
      FOLLOW: 'follow'
    }
  },

  // Cinco motivos fixos (a Aula 15 lê estas denúncias com a mesma lista).
  REPORT: {
    REASONS: ['inappropriate_content', 'harassment', 'spam', 'copyright', 'other'],
    STATUS: {
      PENDING: 'pending',
      REVIEWED: 'reviewed'
    }
  },

  ADMIN: {
    REPORT_FILTERS: ['pending', 'reviewed', 'all']
  },

  SEARCH: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    LIMIT: 10
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50
  },

  UPLOAD: {
    AUDIO_MAX_SIZE: 20 * 1024 * 1024,
    COVER_MAX_SIZE: 5 * 1024 * 1024,
    PROFILE_MAX_SIZE: 5 * 1024 * 1024,
    AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg'],
    COVER_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    AUDIO_MIME_BY_EXT: {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg'
    }
  }
};
