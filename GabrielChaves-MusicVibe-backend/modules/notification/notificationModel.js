const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { NOTIFICATION } = require('../../config/constants');

// Aviso para o dono de um item (ou para a pessoa seguida). As FKs são
// declaradas em config/associations.js (só belongsTo: o ON DELETE depende disso).
const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Quem RECEBE o aviso
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },

    // Quem AGIU (curtiu, comentou, seguiu)
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },

    type: {
      type: DataTypes.ENUM(...Object.values(NOTIFICATION.TYPES)),
      allowNull: false
    },

    // Opcional: "follow" não tem item. Se o item for excluído, vira NULL (SET NULL).
    songId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'songs', key: 'id' }
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    tableName: 'notifications',
    indexes: [
      { fields: ['user_id', 'is_read'], name: 'idx_notifications_user_read' },
      { fields: ['song_id'], name: 'idx_notifications_song_id' }
    ]
  }
);

module.exports = Notification;
