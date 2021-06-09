'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MyPlaylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MyPlaylist.belongsTo(models.User);
      MyPlaylist.belongsTo(models.masterPlaylist, {
        foreignKey: 'genreId',
        sourceKey: 'genreId'
      });
      MyPlaylist.hasOne(models.customPlaylist, {
        foreignKey: 'genreId',
        sourceKey: 'genreId'
      });
    }
  };
  MyPlaylist.init({
    userId: DataTypes.INTEGER,
    genreId: DataTypes.INTEGER,
    flag: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MyPlaylist',
  });
  return MyPlaylist;
};