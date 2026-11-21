const { Op } = require('sequelize');

const { User, Song } = require('../../config/associations');
const { SEARCH } = require('../../config/constants');
const { escapeLike } = require('../../utils/escapeLike');

function searchSongs(query) {
  return Song.findAll({
    where: { title: { [Op.like]: `%${escapeLike(query)}%` } },
    include: [
      {
        model: User,
        as: 'author',
        // só dados públicos do autor (nunca password/email)
        attributes: ['id', 'username', 'fullName', 'profilePicture']
      }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit: SEARCH.LIMIT
  });
}

function searchUsers(query) {
  const pattern = `%${escapeLike(query)}%`;

  return User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.like]: pattern } },
        { fullName: { [Op.like]: pattern } }
      ]
    },
    attributes: ['id', 'username', 'fullName', 'profilePicture'],
    order: [['username', 'ASC']],
    limit: SEARCH.LIMIT
  });
}

// As duas consultas não dependem uma da outra: rodam em paralelo.
// (Sem `this`: o Promise.all chama as funções soltas, fora de objeto.)
async function globalSearch(query) {
  const [songs, users] = await Promise.all([searchSongs(query), searchUsers(query)]);

  return { songs, users };
}

module.exports = { globalSearch };
