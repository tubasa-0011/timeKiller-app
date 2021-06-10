'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserSetting.init({
    userId: DataTypes.INTEGER,
    playlistFlag: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserSetting',
  });
  return UserSetting;
};