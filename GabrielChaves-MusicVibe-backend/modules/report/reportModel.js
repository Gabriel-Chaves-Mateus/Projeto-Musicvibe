const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { REPORT } = require('../../config/constants');

// Denúncia de um item. Uma pessoa denuncia um item uma única vez (índice único).
const Report = sequelize.define(
  'Report',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },

    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'songs', key: 'id' }
    },

    // Segunda defesa do motivo (a primeira é o validator): o banco guarda CHAVES.
    reason: {
      type: DataTypes.ENUM(...REPORT.REASONS),
      allowNull: false
    },

    // Situação da denúncia. O defaultValue é o que permite acrescentar a coluna a uma
    // tabela que JÁ TEM linhas (sync alter): as denúncias antigas viram 'pending'.
    status: {
      type: DataTypes.ENUM(...Object.values(REPORT.STATUS)),
      allowNull: false,
      defaultValue: REPORT.STATUS.PENDING
    },

    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'reports',
    indexes: [
      { unique: true, fields: ['user_id', 'song_id'], name: 'idx_unique_report_user_song' },
      { fields: ['song_id'], name: 'idx_reports_song_id' },
      { fields: ['status'], name: 'idx_reports_status' }
    ]
  }
);

module.exports = Report;
