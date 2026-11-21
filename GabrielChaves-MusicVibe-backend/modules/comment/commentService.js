const sequelize = require('../../config/database');
const { User, Song, Comment } = require('../../config/associations');
const { NOTIFICATION } = require('../../config/constants');
const { createNotification } = require('../notification/notificationService');

const AUTHOR_ATTRIBUTES = ['id', 'username', 'fullName', 'profilePicture'];

const authorInclude = {
  model: User,
  as: 'author',
  attributes: AUTHOR_ATTRIBUTES
};

function songNotFound() {
  const error = new Error('Música não encontrada.');
  error.status = 404;
  return error;
}

// Ordem dos parâmetros: (userId, songId, content). Todos são "soltos" e dois
// são números: se trocar userId com songId, nada quebra, só os dados.
async function createComment(userId, songId, content) {
  const commentId = await sequelize.transaction(async (transaction) => {
    const song = await Song.findByPk(songId, { transaction });

    if (!song) {
      throw songNotFound();
    }

    const comment = await Comment.create(
      { userId, songId, content },
      { transaction }
    );

    await song.increment('commentsCount', { transaction });

    // Só cria: a API não exclui comentários, então não há "desfazer".
    await createNotification(
      { userId: song.userId, actorId: userId, type: NOTIFICATION.TYPES.COMMENT, songId: song.id },
      transaction
    );

    return comment.id;
  });

  // Devolve o comentário COM o autor: o front precisa de nome e foto
  // para mostrá-lo na lista sem recarregar.
  return Comment.findByPk(commentId, { include: authorInclude });
}

async function getComments(songId) {
  const song = await Song.findByPk(songId, { attributes: ['id'] });

  if (!song) {
    throw songNotFound();
  }

  return Comment.findAll({
    where: { songId },
    include: authorInclude,
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });
}

module.exports = { createComment, getComments };
