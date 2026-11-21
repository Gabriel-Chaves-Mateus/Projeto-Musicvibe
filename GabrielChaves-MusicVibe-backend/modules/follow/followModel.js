const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Tabela de ligação USUÁRIO ↔ USUÁRIO: cada linha diz "followerId segue followingId".
const Follow = sequelize.define(
  'Follow',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    timestamps: true,
    tableName: 'follows',
    indexes: [
      {
        // "Ninguém segue a mesma pessoa duas vezes": regra do BANCO.
        // A ORDEM importa: este índice também atende buscas só por follower_id
        // ("quem eu sigo"), pois o MySQL usa o prefixo mais à esquerda.
        unique: true,
        fields: ['follower_id', 'following_id'],
        name: 'idx_unique_follower_following'
      },
      {
        // Segundo índice: "quem segue a pessoa X?" filtra só por following_id,
        // que NÃO é prefixo do índice composto acima.
        fields: ['following_id'],
        name: 'idx_follows_following_id'
      }
    ]
  }
);

module.exports = Follow;
