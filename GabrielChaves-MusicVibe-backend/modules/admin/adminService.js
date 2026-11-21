const { Op } = require('sequelize');

const { User, Song, Like, Comment, Report } = require('../../config/associations');
const { REPORT } = require('../../config/constants');
const { escapeLike } = require('../../utils/escapeLike');

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Sete contagens independentes: rodam em paralelo.
async function getDashboardStats() {
  const [users, blockedUsers, songs, comments, likes, pendingReports, reviewedReports] =
    await Promise.all([
      User.count(),
      User.count({ where: { isBlocked: true } }),
      Song.count(),
      Comment.count(),
      Like.count(),
      Report.count({ where: { status: REPORT.STATUS.PENDING } }),
      Report.count({ where: { status: REPORT.STATUS.REVIEWED } })
    ]);

  return { users, blockedUsers, songs, comments, likes, pendingReports, reviewedReports };
}

const PUBLIC_USER = ['id', 'username', 'fullName', 'profilePicture'];

async function getReports(status, page, limit) {
  const offset = (page - 1) * limit;
  const where = status === 'all' ? {} : { status };

  const { rows, count } = await Report.findAndCountAll({
    where,
    include: [
      { model: User, as: 'Reporter', attributes: PUBLIC_USER },
      {
        model: Song,
        as: 'song',
        attributes: ['id', 'title', 'cover'],
        include: [{ model: User, as: 'author', attributes: PUBLIC_USER }]
      }
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });

  return { reports: rows, page, limit, total: count, hasMore: offset + rows.length < count };
}

// Idempotente: só escreve se ainda não estava revisada. O reload() devolve o
// reviewedAt gravado pelo BANCO (e o de sempre, se já estava revisada).
async function reviewReport(id) {
  const report = await Report.findByPk(id);

  if (!report) {
    throw httpError('Denúncia não encontrada.', 404);
  }

  if (report.status !== REPORT.STATUS.REVIEWED) {
    await report.update({ status: REPORT.STATUS.REVIEWED, reviewedAt: new Date() });
  }

  await report.reload();

  return { id: report.id, status: report.status, reviewedAt: report.reviewedAt };
}

async function getUsers(search, page, limit) {
  const offset = (page - 1) * limit;
  const pattern = `%${escapeLike(search)}%`;

  const where = search
    ? {
        [Op.or]: [
          { username: { [Op.like]: pattern } },
          { email: { [Op.like]: pattern } },
          { fullName: { [Op.like]: pattern } }
        ]
      }
    : {};

  const { rows, count } = await User.findAndCountAll({
    where,
    // lista explícita: nunca o password
    attributes: [
      'id', 'username', 'email', 'fullName', 'profilePicture', 'isBlocked', 'isAdmin',
      'followersCount', 'followingCount', 'songsCount', 'createdAt'
    ],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });

  return { users: rows, page, limit, total: count, hasMore: offset + rows.length < count };
}

// 404 → 400 (a si mesmo) → 403 (outro administrador). Grava só se mudar.
async function setUserBlocked(targetId, isBlocked, adminId) {
  const target = await User.findByPk(targetId, { attributes: ['id', 'username', 'isAdmin', 'isBlocked'] });

  if (!target) {
    throw httpError('Usuário não encontrado.', 404);
  }

  if (target.id === adminId) {
    throw httpError('Você não pode bloquear a si mesmo.', 400);
  }

  if (target.isAdmin) {
    throw httpError('Não é possível bloquear outro administrador.', 403);
  }

  if (target.isBlocked !== isBlocked) {
    await target.update({ isBlocked });
  }

  return { id: target.id, username: target.username, isBlocked: target.isBlocked };
}

async function getSongs(search, page, limit) {
  const offset = (page - 1) * limit;
  const where = search ? { title: { [Op.like]: `%${escapeLike(search)}%` } } : {};

  const { rows, count } = await Song.findAndCountAll({
    where,
    include: [{ model: User, as: 'author', attributes: PUBLIC_USER }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });

  // Segunda consulta, agrupada, só com os ids DESTA página: evita um include agrupado
  // (que multiplicaria as linhas e quebraria o limit/offset).
  const ids = rows.map((song) => song.id);
  const totals = new Map();

  if (ids.length > 0) {
    const grouped = await Report.findAll({
      attributes: ['songId', [Report.sequelize.fn('COUNT', Report.sequelize.col('id')), 'total']],
      where: { songId: { [Op.in]: ids }, status: REPORT.STATUS.PENDING },
      group: ['songId'],
      raw: true
    });

    grouped.forEach((row) => totals.set(row.songId, Number(row.total)));
  }

  const songs = rows.map((song) => ({
    ...song.toJSON(),
    pendingReportsCount: totals.get(song.id) || 0
  }));

  return { songs, page, limit, total: count, hasMore: offset + rows.length < count };
}

module.exports = {
  getDashboardStats,
  getReports,
  reviewReport,
  getUsers,
  setUserBlocked,
  getSongs
};
