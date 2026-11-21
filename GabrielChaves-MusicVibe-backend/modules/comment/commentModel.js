const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { VALIDATION } = require('../../config/constants');

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    content: {
      type: DataTypes.STRING(VALIDATION.COMMENT_MAX),
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'comments'
  }
);

module.exports = Comment;
