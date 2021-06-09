const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
const sendMail = require('sendmail')();
const { check, validationResult } = require("express-validator");
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();

const pNum = 10;

//ログインチェックの関数
function loginCheck(req, res) {
  if (req.session.login == null) {
    req.session.back = '/timeKiller';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}

// トップページへのアクセス
router.get('/', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var data = {
    title: 'たいむきらー',
    name: 'name',
    namename: 'さとう',
    ver: 2.0
  }
  res.render('timeKiller/index', data);
});

// ルーレットページへのアクセス
router.get('/roulette', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var data = {
    title: 'たいむきらー',
    content: "動画"
  }
  res.render('timeKiller/roulette', data);
});

// 開発者ページへのアクセス
router.get('/developer', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var data = {
    title: 'たいむきらー',
    title2: 'せーさくしゃじょーほー',
    tanakaName: '田中 翼',
    tanakaText: 'ほげほげ',
    nakamuraName: '中村 航生',
    nakamuraText: 'ほほげげ',
    satoName: '佐藤 翔大',
    satoText: '東京電機大学卒業。2021年4月に株式会社クオーレに入社。プログラム歴3ヶ月（2021年6月現在）。趣味はゲーム、漫画、アニメ、野球観戦等々。水族館溺愛者。肩こりが悩み。',
  }
  res.render('timeKiller/developer', data);
});

// 写経ページへのアクセス
router.get('/syakei', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var data = {
    title: 'たいむきらー',
    title2: 'しゃけー',
  }
  res.render('timeKiller/syakei', data);
});

//検索フォームの送信処理
router.post('/', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  db.Markdata.findAll({
    where: {
      userId: req.session.login.id,
      content: { [ Op.like ]: '%' + req.body.find + '%' },
    },
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds => {
    var data = {
      title: 'timeKiller Search',
      login: req.session.login,
      message: '※"' + req.body.find + '"で検索された最近の投稿データ',
      form: req.body,
      content: mds,
    }
    res.render('timeKiller/index', data);
  })
});

//プレイリストページ
router.get('/playlist', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var mc = 0, cc = 0;
  db.masterPlaylist.findAll().then(mPls => {
    mc = Object(mPls).length;
    console.log(mc)
  });
  db.customPlaylist.findAll({
      where: { 
        userId: req.session.login.id,
      },
    }
  ).then(cPls => {
    cc = Object(cPls).length;
    console.log(cc)
  });
  db.MyPlaylist.findAll({
    include: [
      { model: db.masterPlaylist },
      { model: db.customPlaylist },
    ],
    where: { 
      userId: req.session.login.id,
    },
  }).then(pls => {
    for(let pl of pls){
      console.log( pl.customPlaylist );
    }
      var data = {
        title: "Other",
        pls: pls,
        mc: mc,
        cc: cc+mc+1,
      }
      res.render('timeKiller/playlist', data);
  });
});

//プレイリストフォームの送信処理
router.post('/playlist', (req, res, next) => {
  if (check(req, res, next)) { return }
  redirect('/timeKiller');
});

//新規プレイリスト追加の送信処理
router.post('/playlistAdd', (req, res, next) => {
  if (loginCheck(req, res, next)) { return }
  var cc = 0;
  db.customPlaylist.findAll({
    where: { 
      userId: req.session.login.id,
    },
  }).then(cPls => {
  cc = Object(cPls).length;
  console.log(cc)
  });
  db.sequelize.sync().then(() => db.customPlaylist.create({
    userId: req.session.login.id,
    genreId: 101 + cc,
    genreName: req.body.detail,
  })
  .catch((err)=>{
    res.redirect('/timeKiller/playlist');
  })
  )
  db.sequelize.sync().then(() => db.MyPlaylist.create({
      userId: req.session.login.id,
      genreId: 101 + cc,
      flag: true,
    })
      .then(brd => {
        res.redirect('/timeKiller/playlist');
      })
      .catch((err)=>{
        res.redirect('/timeKiller/playlist');
      })
    )
});

//お問い合わせページ
router.get('/contact', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var data = {
    title: 'お問い合わせ',
    content: '',
    form: {subject: '', mail: '', detail: ''},
  }
  res.render('timeKiller/contact', data);
});

//お問い合わせフォームの送信処理
router.post('/contact', [
  check('subject', 'SUBJECTは必ず記入してください').notEmpty().escape(),
  check('mail', 'メールアドレス形式で必ず記入してください。').isEmail().escape(),
  check('detail', 'お問い合わせ内容は必ず入力してください。').notEmpty().escape()
], (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var result = '<ul class="text-danger">';
    var result_arr = errors.array();
    for(var n in result_arr){
      result +='<li>'+ result_arr[n].msg + '</li>';
    }
    result += '</ul>';
    var data = {
      title: 'お問い合わせ',
      content: result,
      form: req.body,
    }
    res.render('timeKiller/contact', data);
  }else{
    sendMail({
      from: req.body.mail,
      to: 't.tanaka@cuore.jp',
      subject: '㋪アプリ：' + req.session.login.name + '：' + req.body.subject,
      text: req.body.detail,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
    });
    res.redirect('/timeKiller');
  }
});

//'/mark'へのアクセスしたさいのリダイレクト
router.get('/mark', (req, res, next) => {
  res.redirect('/timeKiller');
  return;
});

//指定IDのMarkdata表示
router.get('/mark/:id', (req, res, next) => {
  if (loginCheck(req, res)) { return };
  db.Markdata.findOne({
    where: {
      id: req.params.id,
      userId: req.session.login.id
    },
  })
    .then((model) => {
      makePage(req, res, model, true);
    })
});

//Markdataの更新処理
router.post('/mark/:id', (req, res, next) => {
  if (loginCheck(req, res)) { return };
  db.Markdata.findByPk(req.params.id)
    .then(md => {
      md.content = req.body.source;
      md.save().then((model) => {
        makePage(req, res, model, false);
      });
    })
});

//指定IDのMarkdataの表示ページを作成
function makePage(req, res, model, flg) {
  var footer;
  if (flg) {
    var d1 = new Date(model.createdAt);
    var dString1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();
    var d2 = new Date(model.updatedAt);
    var dString2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate();
    footer = '(created: ' + dString1 + 'updated: ' + dString2 + ')';
  } else {
    footer = '(Updating date and time information...)';
  }
  var data = {
    title: 'Markdown',
    id: req.params.id,
    head: model.title,
    footer: footer,
    content: markdown.render(model.content),
    source: model.content
  };
  res.render('timeKiller/mark', data);
}

//URL表示ページ
router.get('/url', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  db.Markdata.findAll({
    where: { userId: req.session.login.id },
    limit: pNum,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds => {
    var data = {
      title: '動画で暇つぶし',
      content: "https://www.youtube.com/watch?v=7WZ1Kt3zraY",
    }
    res.render('timeKiller/url', data);
  })
});

module.exports = router;
