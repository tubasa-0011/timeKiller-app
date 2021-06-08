'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customPlaylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customPlaylist.belongsTo(models.User);
      customPlaylist.hasMany(models.MyPlaylist, {
        foreignKey: 'genreId',
        sourceKey: 'genreId',
      });
    }
  };
  customPlaylist.init({
    userId: DataTypes.INTEGER,
    genreId: DataTypes.INTEGER,
    genreName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customPlaylist',
  });
  return customPlaylist;
};