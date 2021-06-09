'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('masterPlaylists', [
      {
        genreId: 1,
        genreName: '動画リンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 2,
        genreName: '音楽リンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 3,
        genreName: '本リンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 4,
        genreName: 'ウェブラジオリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 5,
        genreName: 'ニュースリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 6,
        genreName: 'SNSリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 7,
        genreName: 'まとめサイトリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 8,
        genreName: 'ウィキランダムリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 9,
        genreName: 'なぞなぞ・クイズリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 10,
        genreName: 'ミニゲームリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 11,
        genreName: '心理テストリンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 12,
        genreName: '名言集リンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        genreId: 13,
        genreName: '名言作成リンク',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('masterPlaylists', null, {});
  }
};
