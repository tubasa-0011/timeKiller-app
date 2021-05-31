const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { OP } = require('sequelize');

const pNum = 10;

//ログインのチェック
function check(req, res) {
  if (req.session.login == null) {
    req.session.back = '/boards';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}

//トップページ
router.get('/', (req, res, next) => {
  res.redirect('/boards/0');
});

// トップページに番号をつけてアクセス
router.get('/:page', (req, res, next) => {
  if (check(req, res, next)) { return };
  const pg = req.params.page * 1;
  db.Board.findAll({
    offset: pg * pNum,
    limit: pNum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login: req.session.login,
      content: brds,
      page: pg
    }
    res.render('boards/index', data);
  })
});

//メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
  if (check(req, res, next)) { return }
  db.sequelize.sync()
      .then(() => db.Board.create({
      userId: req.session.login.id,
      message: req.body.msg,
    })
      .then(brd => {
        res.redirect('/boards');
      })
      .catch((err)=>{
        res.redirect('/boards');
      })
    )
});

//利用者ホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
  if (check(req, res, next)) { return };
  const id = req.params.id * 1;
  const pg = req.params.page * 1;
  db.Board.findAll({
    where: {userId: id},
    offset: pg * pNum,
    limit: pNum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login: req.session.login,
      userId: id,
      userName: req.params.user,
      content: brds,
      page: pg
    }
    res.render('boards/home', data);
  })
});

module.exports = router;
