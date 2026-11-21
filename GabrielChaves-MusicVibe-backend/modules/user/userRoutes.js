const express = require('express');
const router = express.Router();
const { registerValidator, loginValidator, profileUpdateValidator } = require('./userValidator');
const { isAuthenticated } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');

const userController = require('./userController');
const asyncHandler = require('../../middlewares/asyncHandler');
const profileUpload =
  require('../../middlewares/profileMulter');

router.post(
  '/register',
  registerValidator,
  asyncHandler(userController.register)
);

router.post(
  '/login',
  loginValidator,
  asyncHandler(userController.login)
);

router.post(
  '/logout',
  isAuthenticated,
  asyncHandler(userController.logout)
);

router.put(
  '/profile/me',
  isAuthenticated,
  profileUpload.single('profilePicture'),
  profileUpdateValidator,
  asyncHandler(userController.updateProfile)
);

router.get(
  '/feed',
  isAuthenticated,
  asyncHandler(userController.getFeed)
);

router.get(
  '/profile/me',
  isAuthenticated,
  asyncHandler(userController.getMyProfile)
);

// Depois de /profile/me, senão "me" seria tratado como um username.
router.get(
  '/profile/:username',
  optionalAuth,
  asyncHandler(userController.getPublicProfile)
);

module.exports = router;