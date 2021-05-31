'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Board.belongsTo(models.User);
    }
  };
  Board.init({
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "利用者は必須です。"
        }
      }
    },
    message: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "メッセージは必須です。"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};