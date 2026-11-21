const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { VALIDATION } = require('../../config/constants');

// Coleção pessoal de músicas. A FK com User fica em config/associations.js;
// aqui só a coluna userId (references) e o índice.
const Playlist = sequelize.define(
  'Playlist',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING(VALIDATION.PLAYLIST_TITLE_MAX),
      allowNull: false
    },

    description: {
      type: DataTypes.STRING(VALIDATION.PLAYLIST_DESCRIPTION_MAX),
      allowNull: true
    },

    // Privada por padrão: a pessoa precisa escolher tornar pública.
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    // Contador guardado: mantido em transação junto com a linha da junção.
    songsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  },
  {
    timestamps: true,
    tableName: 'playlists',
    indexes: [{ fields: ['user_id'], name: 'idx_playlists_user_id' }]
  }
);

module.exports = Playlist;
