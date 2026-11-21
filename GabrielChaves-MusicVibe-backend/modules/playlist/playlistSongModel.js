const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Tabela de JUNÇÃO (muitos-para-muitos): uma playlist tem várias músicas e
// uma música pode estar em várias playlists. Cada linha = "esta música está
// nesta playlist".
const PlaylistSong = sequelize.define(
  'PlaylistSong',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'playlists', key: 'id' }
    },

    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'songs', key: 'id' }
    }
  },
  {
    timestamps: true,
    tableName: 'playlist_songs',
    indexes: [
      {
        // Uma música só entra uma vez em cada playlist (regra do BANCO).
        // Também acelera "a música X está na playlist Y?" e "as músicas da
        // playlist Y" (prefixo mais à esquerda: playlist_id).
        unique: true,
        fields: ['playlist_id', 'song_id'],
        name: 'idx_unique_playlist_song'
      },
      {
        // "Em quais playlists está a música X?" filtra só por song_id, que
        // não é prefixo do índice composto; e a exclusão da música usa isto.
        fields: ['song_id'],
        name: 'idx_playlist_songs_song_id'
      }
    ]
  }
);

module.exports = PlaylistSong;
