// % e _ são curingas do LIKE: digitar "%%" casaria com TUDO. A barra invertida
// também é escapada (ela é o escape do próprio LIKE). "\\$&" = barra + o caractere casado.
function escapeLike(text) {
  return text.replace(/[\\%_]/g, '\\$&');
}

module.exports = { escapeLike };
