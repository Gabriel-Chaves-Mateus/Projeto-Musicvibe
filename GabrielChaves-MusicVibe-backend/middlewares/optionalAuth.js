const { verifyToken } = require('../config/jwt');

// Diferente de isAuthenticated, este middleware NUNCA bloqueia.
// Com token válido: preenche req.user. Sem token, ou com token
// inválido/expirado: segue como visitante (req.user fica undefined).
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(authHeader.split(' ')[1]);
    } catch (err) {
      // token ruim em rota pública: trata como visitante
    }
  }

  next();
}

module.exports = { optionalAuth };
