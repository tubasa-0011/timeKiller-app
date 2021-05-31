'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdata.belongsTo(models.User);
    }
  };
  Markdata.init({
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "利用者は必須です。"
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "タイトルは必須です。"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "コンテンツは必須です。"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Markdata',
  });
  return Markdata;
};