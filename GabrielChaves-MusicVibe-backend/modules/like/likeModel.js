const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Like = sequelize.define(
  'Like',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    timestamps: true,
    tableName: 'likes',
    indexes: [
      {
        // "Uma pessoa só curte uma vez" é regra do BANCO: mesmo que o código
        // tenha um bug ou duas requisições cheguem juntas, o banco recusa.
        unique: true,
        fields: ['user_id', 'song_id'],
        name: 'idx_unique_user_song_like'
      }
    ]
  }
);

module.exports = Like;
