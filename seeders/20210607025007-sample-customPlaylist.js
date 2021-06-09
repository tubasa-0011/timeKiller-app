'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('customPlaylists', [
      {
        userId: 1,
        genreId: 1,
        genreName: '記事',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('customPlaylists', null, {});
  }
};
