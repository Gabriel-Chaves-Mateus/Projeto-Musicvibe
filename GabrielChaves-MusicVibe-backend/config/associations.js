// Todas as associações entre models ficam aqui.
// Se cada model importasse o outro para declarar hasMany/belongsTo,
// teríamos referência circular (User -> Song -> User). Aqui todos os
// models são importados num único ponto, sem que um conheça o outro.
const User = require('../modules/user/userModel');
const Song = require('../modules/song/songModel');
const Like = require('../modules/like/likeModel');
const Comment = require('../modules/comment/commentModel');
const Follow = require('../modules/follow/followModel');
const Playlist = require('../modules/playlist/playlistModel');
const PlaylistSong = require('../modules/playlist/playlistSongModel');
const Notification = require('../modules/notification/notificationModel');
const Report = require('../modules/report/reportModel');

// Um usuário tem várias músicas; cada música pertence a um usuário.
// O Sequelize NÃO deduz isso sozinho: sem estas linhas não existe FK.
User.hasMany(Song, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'songs',
  onDelete: 'CASCADE'
});

Song.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'author'
});

// Curtidas: User 1—N Like, Song 1—N Like (nos dois sentidos)
User.hasMany(Like, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'likes'
});
Like.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'user'
});

Song.hasMany(Like, {
  foreignKey: { name: 'songId', allowNull: false },
  as: 'likes'
});
Like.belongsTo(Song, {
  foreignKey: { name: 'songId', allowNull: false },
  as: 'song'
});

// Comentários: User 1—N Comment, Song 1—N Comment (nos dois sentidos)
User.hasMany(Comment, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'comments'
});
Comment.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'author'
});

Song.hasMany(Comment, {
  foreignKey: { name: 'songId', allowNull: false },
  as: 'comments'
});
Comment.belongsTo(Song, {
  foreignKey: { name: 'songId', allowNull: false },
  as: 'song'
});

// Seguir: a tabela follows liga User a User DUAS vezes (quem segue e quem é
// seguido). Por isso cada associação precisa de um apelido (as); sem ele o
// Sequelize não saberia qual das duas FKs usar em um include.
//   Follow.Follower  → a pessoa que segue   (followerId)
//   Follow.Following → a pessoa seguida     (followingId)
User.hasMany(Follow, {
  foreignKey: { name: 'followerId', allowNull: false },
  as: 'followingRelations',
  onDelete: 'CASCADE'
});
User.hasMany(Follow, {
  foreignKey: { name: 'followingId', allowNull: false },
  as: 'followerRelations',
  onDelete: 'CASCADE'
});
Follow.belongsTo(User, {
  as: 'Follower',
  foreignKey: { name: 'followerId', allowNull: false }
});
Follow.belongsTo(User, {
  as: 'Following',
  foreignKey: { name: 'followingId', allowNull: false }
});

// Playlists: User 1—N Playlist; Playlist N—N Song através de PlaylistSong.
// Seis associações: Playlist<->PlaylistSong, Song<->PlaylistSong, User<->Playlist.
User.hasMany(Playlist, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'playlists',
  onDelete: 'CASCADE'
});
Playlist.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'author',
  onDelete: 'CASCADE'
});

Playlist.hasMany(PlaylistSong, {
  foreignKey: { name: 'playlistId', allowNull: false },
  as: 'playlistSongs',
  onDelete: 'CASCADE'
});
PlaylistSong.belongsTo(Playlist, {
  foreignKey: { name: 'playlistId', allowNull: false },
  as: 'playlist',
  onDelete: 'CASCADE'
});

Song.hasMany(PlaylistSong, {
  foreignKey: { name: 'songId', allowNull: false },
  as: 'playlistSongs',
  onDelete: 'CASCADE'
});
PlaylistSong.belongsTo(Song, {
  foreignKey: { name: 'songId', allowNull: false },
  as: 'song',
  onDelete: 'CASCADE'
});

// Notificações: só belongsTo (sem hasMany de volta). O ON DELETE vem da FK:
//   songId aceita NULL -> SET NULL (excluir a música NÃO apaga o aviso sozinho)
//   userId/actorId NOT NULL -> NO ACTION
// Apelidos Recipient/Actor: a tabela liga User a User duas vezes.
Notification.belongsTo(User, {
  as: 'Recipient',
  foreignKey: { name: 'userId', allowNull: false }
});
Notification.belongsTo(User, {
  as: 'Actor',
  foreignKey: { name: 'actorId', allowNull: false }
});
Notification.belongsTo(Song, {
  as: 'song',
  foreignKey: { name: 'songId', allowNull: true }
});

// Denúncias: songId NOT NULL -> NO ACTION (excluir a música com denúncia dá erro de FK
// se o código não apagar as denúncias antes).
Report.belongsTo(User, {
  as: 'Reporter',
  foreignKey: { name: 'userId', allowNull: false }
});
Report.belongsTo(Song, {
  as: 'song',
  foreignKey: { name: 'songId', allowNull: false }
});

module.exports = { User, Song, Like, Comment, Follow, Playlist, PlaylistSong, Notification, Report };
