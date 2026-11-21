export function getProfileImageUrl(filename) {
  if (!filename) {
    filename = 'default-profile.png';
  }

  return `${
    import.meta.env.VITE_MEDIA_URL
  }/uploads/profiles/${filename}`;
}

export function getSongAudioUrl(filename) {
  // Arquivo ESTÁTICO. Nunca a rota /stream: <audio> não envia Authorization.
  return `${import.meta.env.VITE_MEDIA_URL}/uploads/songs/audio/${filename}`;
}

export function getSongCoverUrl(filename) {
  return `${import.meta.env.VITE_MEDIA_URL}/uploads/songs/covers/${filename}`;
}
