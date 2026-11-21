const userService = require('./userService');
const { parsePagination } = require('../../utils/pagination');
const { success } = require('../../middlewares/apiResponse');

exports.updateProfile = async (req, res) => {
  const updatedUser =
    await userService.updateUserProfile(
      req.user.id,
      req.body,
      req.file
    );

  return success(
    res,
    updatedUser,
    'Perfil atualizado com sucesso.'
  );
};

exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    fullName
  } = req.body;

  const newUser = await userService.registerUser(
    username,
    email,
    password,
    fullName
  );

  return success(
    res,
    newUser,
    'Conta criada com sucesso! Faça login para continuar.',
    201
  );
};

exports.getPublicProfile = async (req, res) => {
  const user = await userService.getPublicProfile(
    req.params.username,
    req.user?.id
  );

  return success(res, user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await userService.loginUser(
    email,
    password
  );

  return success(
    res,
    result,
    'Login realizado com sucesso!'
  );
};

exports.logout = async (req, res) => {
  return success(
    res,
    null,
    'Logout realizado com sucesso.'
  );
};

exports.getMyProfile = async (req, res) => {
  const user = await userService.getUserProfile(
    req.user.id
  );

  return success(res, user);
};

// GET /api/feed?page=1&limit=12
exports.getFeed = async (req, res) => {
  // parsePagination normaliza page/limit (inválido -> padrão; limit limitado ao teto).
  const { page, limit } = parsePagination(req.query);

  const feed = await userService.getFeed(page, limit);

  return success(res, feed);
};
