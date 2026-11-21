// "há 5 min", "há 2 h", "há 3 d" ou a data completa para datas mais antigas.
export function formatRelativeDate(isoDate) {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days} d`;

  return date.toLocaleDateString('pt-BR');
}

// 1200 -> "1,2 mil"
export function formatCount(value) {
  const n = Number(value) || 0;

  if (n >= 1000) {
    return `${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`;
  }

  return String(n);
}
