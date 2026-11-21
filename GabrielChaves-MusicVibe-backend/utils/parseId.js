// Converte um identificador vindo de req.params / req.body em inteiro positivo,
// ou lança 400 "Identificador de <label> inválido.".
// Tudo que chega de params é string ("5"); do corpo pode vir número, texto,
// null, array... Só string e número são aceitos, e Number("") dá 0 (recusado
// pelo < 1), Number("5abc") dá NaN, Number("1.5") não é inteiro.
function parseId(rawValue, label) {
  const isText = typeof rawValue === 'string' && rawValue.trim() !== '';
  const number = isText || typeof rawValue === 'number' ? Number(rawValue) : NaN;

  if (!Number.isInteger(number) || number < 1) {
    const error = new Error(`Identificador de ${label} inválido.`);
    error.status = 400;
    throw error;
  }

  return number;
}

module.exports = { parseId };
