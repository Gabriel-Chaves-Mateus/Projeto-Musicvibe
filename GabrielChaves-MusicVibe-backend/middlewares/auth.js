const { verifyToken } = require('../config/jwt');
const { User } = require('../config/associations');

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// AUTENTICAÇÃO: "quem é você?". Confere o token E consulta o banco a cada requisição:
// o papel (isAdmin) e o bloqueio valem AGORA, não na hora em que o token foi emitido.
// Custo: uma consulta por chave primária por requisição autenticada.
async function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(httpError('Token de autenticação não fornecido.', 401));
  }

  const token = authHeader.split(' ')[1];

  // (a) este try/catch cobre SÓ a verificação do token: erro aqui = token ruim = 401.
  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(httpError('Token inválido ou expirado.', 401));
  }

  // (f) a consulta tem o próprio try/catch: erro de banco NÃO é "token inválido".
  try {
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'isAdmin', 'isBlocked']
    });

    // conta apagada: o token ainda é válido, mas não aponta para ninguém
    if (!user) {
      return next(httpError('Token inválido ou expirado.', 401));
    }

    if (user.isBlocked) {
      return next(httpError('Sua conta foi bloqueada. Entre em contato com a administração.', 401));
    }

    // o isAdmin vem do BANCO, não do token
    req.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };

    return next();
  } catch (err) {
    return next(err);
  }
}

// AUTORIZAÇÃO: "você pode fazer isto?". Só faz sentido DEPOIS do isAuthenticated
// (é ele quem monta o req.user). Papel insuficiente = 403.
function isAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return next(httpError('Acesso restrito a administradores.', 403));
  }

  return next();
}

module.exports = {
  isAuthenticated,
  isAdmin
};
