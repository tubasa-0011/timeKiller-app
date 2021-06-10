'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserSettings',[
      {
        userId: 1,
        playlistFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        userId: 2,
        playlistFlag: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserSettings', null, {});
  }
};
