'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class masterPlaylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      masterPlaylist.hasMany(models.MyPlaylist, {
        foreignKey: 'genreId',
        sourceKey: 'genreId'
      });
    };
  };
  masterPlaylist.init({
    genreId: DataTypes.INTEGER,
    genreName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'masterPlaylist',
  });
  return masterPlaylist;
};