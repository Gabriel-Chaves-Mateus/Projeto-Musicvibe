const User = require('./userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../config/jwt');
const songService = require('../song/songService');
const { Song, Follow } = require('../../config/associations');
const fs = require('fs');
const path = require('path');

async function updateUserProfile(
  userId,
  data,
  uploadedFile
) {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.status = 404;
    throw error;
  }

  user.fullName = data.fullName;

  if (data.bio !== undefined) {
    user.bio = data.bio;
  }

  if (uploadedFile) {
    const oldPicture = user.profilePicture;

    user.profilePicture = uploadedFile.filename;

    if (
      oldPicture &&
      oldPicture !== 'default-profile.png'
    ) {
      const oldPath = path.join(
        __dirname,
        '../../public/uploads/profiles',
        oldPicture
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
  }

  await user.save();

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    profilePicture: user.profilePicture,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    songsCount: user.songsCount,
    isAdmin: user.isAdmin
  };
}

async function registerUser(username, email, password, fullName) {
  const emailExists = await User.findOne({
    where: { email }
  });

  const usernameExists = await User.findOne({
    where: { username }
  });

  if (emailExists || usernameExists) {
    const error = new Error('Este e-mail ou usuário já está cadastrado.');
    error.status = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  };
}

async function getPublicProfile(username, viewerId) {
  // include + order no nível de cima: ordenar a lista de músicas
  // exige o order na consulta principal, não dentro do include.
  const user = await User.findOne({
    where: { username },
    attributes: [
      'id',
      'username',
      'fullName',
      'bio',
      'profilePicture',
      'followersCount',
      'followingCount',
      'songsCount'
    ],
    include: [
      {
        model: Song,
        as: 'songs',
        attributes: [
          'id',
          'title',
          'description',
          'cover',
          'playsCount',
          'likesCount',
          'commentsCount',
          'createdAt'
        ]
      }
    ],
    order: [
      [{ model: Song, as: 'songs' }, 'createdAt', 'DESC'],
      [{ model: Song, as: 'songs' }, 'id', 'DESC']
    ]
  });

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.status = 404;
    throw error;
  }

  const isOwner = !!viewerId && user.id === viewerId;

  // Só consulta o banco quando há alguém logado olhando o perfil de OUTRA pessoa.
  let isFollowing = false;

  if (viewerId && !isOwner) {
    const follow = await Follow.findOne({
      where: { followerId: viewerId, followingId: user.id }
    });
    isFollowing = !!follow;
  }

  return {
    ...user.toJSON(),
    isOwner,
    isFollowing
  };
}

async function loginUser(email, password) {
  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    const error = new Error('E-mail ou senha inválidos.');
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error('E-mail ou senha inválidos.');
    error.status = 401;
    throw error;
  }

  if (user.isBlocked) {
    const error = new Error('Sua conta foi bloqueada. Entre em contato com a administração.');
    error.status = 403;
    throw error;
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin
    }
  };
}

async function getUserProfile(userId) {
  const user = await User.findByPk(userId, {
    attributes: [
      'id',
      'username',
      'email',
      'fullName',
      'bio',
      'profilePicture',
      'followersCount',
      'followingCount',
      'songsCount',
      'isAdmin'
    ]
  });

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.status = 404;
    throw error;
  }

  return user;
}

async function getFeed(page, limit) {
  return songService.getFeedSongs(page, limit);
}

module.exports = {
  getFeed,
  registerUser,
  getPublicProfile,
  loginUser,
  getUserProfile,
  updateUserProfile
};