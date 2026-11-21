const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { VALIDATION } = require('../../config/constants');

// Grupo A: dois arquivos (audio = conteúdo principal, cover = capa).
// A associação com User NÃO é declarada aqui: fica em config/associations.js.
const Song = sequelize.define(
  'Song',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING(VALIDATION.TITLE_MAX),
      allowNull: false
    },

    description: {
      type: DataTypes.STRING(VALIDATION.DESCRIPTION_MAX),
      allowNull: true
    },

    audio: {
      type: DataTypes.STRING,
      allowNull: false
    },

    cover: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Contadores guardados: mantidos em transação junto com a linha
    // de Like / Comment (nunca atualizados "soltos").
    likesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    commentsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // Contador de reproduções/visualizações (sobe a cada GET do detalhe)
    playsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    timestamps: true,
    tableName: 'songs'
  }
);

module.exports = Song;
