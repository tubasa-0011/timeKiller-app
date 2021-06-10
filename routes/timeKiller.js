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
    title: req.session.login.name,
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
router.get('/syakyo', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var data = {
    title: 'しゃきょー',
  }
  res.render('timeKiller/syakyo', data);
});

//プレイリストページ
router.get('/playlist', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var mc = 0, cc = 0;
  var us;
  db.UserSetting.findOne({
    where: { 
      userId: req.session.login.id,
    },
  }).then(uss => {
    us = uss;
  });
  db.masterPlaylist.findAll().then(mPls => {
    mc = Object(mPls).length;
  });
  db.customPlaylist.findAll({
      where: { 
        userId: req.session.login.id,
      },
    }
  ).then(cPls => {
    cc = Object(cPls).length;
  });
  db.MyPlaylist.findAll({
    include: [
      { model: db.masterPlaylist },
      { model: db.customPlaylist },
    ],
    where: { 
      userId: req.session.login.id,
    },
    order: [
      ['genreId', 'ASC']
    ]
  }).then(pls => {
      var data = {
        title: "Other",
        pls: pls,
        mc: mc,
        cc: cc+mc,
        us: us,
      }
      res.render('timeKiller/playlist', data);
  });
});

//プレイリストフォームの送信処理
router.post('/playlist', (req, res, next) => {
  if (loginCheck(req, res, next)) { return }
  for(var i in req.body){
    if (req.body[i][1] != undefined) {
      db.MyPlaylist.findOne({ where: { userId: req.session.login.id, genreId: i } }).then(pls => {
        pls.flag = true;
        pls.save();
      })
    }else{
      db.MyPlaylist.findOne({ where: { userId: req.session.login.id, genreId: i } }).then(pls => {
        pls.flag = false;
        pls.save();
      })
    }
  }
  res.redirect('/timeKiller/playlist');
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
  });
  db.sequelize.sync().then(() => 
    db.customPlaylist.create({
      userId: req.session.login.id,
      genreId: 101 + cc,
      genreName: req.body.detail,
    }).catch((err)=>{
      res.redirect('/timeKiller/playlist');
    })
  )
  db.sequelize.sync().then(() => 
    db.MyPlaylist.create({
      userId: req.session.login.id,
      genreId: 101 + cc,
      flag: false,
    }).then(brd => {
      res.redirect('/timeKiller/playlist');
    }).catch((err)=>{
      res.redirect('/timeKiller/playlist');
    })
  )
});

//プレイリスト公開・非公開の送信処理
router.post('/playlistOpen', (req, res, next) => {
  if (loginCheck(req, res, next)) { return }
  console.log(req.body.playlistOpen);
  if (req.body.playlistOpen != undefined) {
    db.UserSetting.findOne({ where: { userId: req.session.login.id } }).then(uss => {
      uss.playlistFlag = true;
      uss.save();
    })
  }else{
    db.UserSetting.findOne({ where: { userId: req.session.login.id } }).then(uss => {
      uss.playlistFlag = false;
      uss.save();
    })
  }
  res.redirect('/timeKiller/playlist');
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

//URL表示ページ
router.get('/url', (req, res, next) => {
  if (loginCheck(req, res, next)) { return };
  var list=[
    ["動画","https://www.youtube.com/watch?v=7WZ1Kt3zraY"],
    ["音楽","https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ?hl=ja"],
    ["本", "https://www.aozora.gr.jp/"],
    ["ウェブラジオ","https://www.onsen.ag/"],
    ["ニュース","https://news.google.co.jp/"],
    ["SNS","http://www.twtimez.net/"],
    ["まとめサイト","http://matome-plus.com/"],
    ["ウィキランダム","http://ja.wikipedia.org/wiki/Special:Randompage"],
    ["なぞなぞ・クイズ","http://nazo-nazo.com/sp/cat398/post-64.html"],
    ["ミニゲーム","https://www.google.com/search?q=%E3%83%91%E3%83%83%E3%82%AF%E3%83%9E%E3%83%B3%E3%82%92%E3%83%97%E3%83%AC%E3%82%A4&biw=2560&bih=1368&ei=UMDBYOvwA4uUr7wPw66O2AE&oq=%E3%83%91%E3%83%83%E3%82%AF%E3%83%9E%E3%83%B3&gs_lcp=Cgdnd3Mtd2l6EAMyBAgAEEMyAggAMg4IABCxAxCDARCxAxCDATIKCAAQsQMQsQMQQzICCAAyBAgAEEMyAggAMgQIABBDOgkIABCwAxAIEB46CAgAEAgQDRAeOgoIABCxAxCDARAEOggIABCxAxCDAToHCAAQsQMQBDoECAAQBFD-KFjOSGCrSmgCcAB4AoABggKIAfEUkgEGMTguNy4xmAEAoAEBqgEHZ3dzLXdperABAMgBA8ABAQ&sclient=gws-wiz&ved=0ahUKEwjr2NbFxozxAhULyosBHUOXAxsQ4dUDCA4&uact=5&stick=H4sIAAAAAAAAAOOwfcQozi3w8sc9YSm-SWtOXmPk4GILSEzOTczjAQBYtGz7HAAAAA"],
    ["心理テスト","https://uranaitv.jp/content/senjutsu/psychology"],
    ["名言作成","https://meigen.makingmethod.com/"],
    ["写経","timeKiller/syakyo"]
  ];
  var n=Math.floor( Math.random() * 12 ) ;
  var data = {
    title: list[n][0],
    content: list[n][1],
    ver: 2.0
  }
  res.render('timeKiller/url', data);
});

module.exports = router;
