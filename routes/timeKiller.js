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
  db.Markdata.findAll({
    where: { userId: req.session.login.id },
    limit: pNum,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds => {
    var data = {
      title: 'たいむきらー',
      name: 'name',
      namename: 'さとう',
      ver: 2.0
    }
    res.render('timeKiller/index', data);
  })
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

// //新規作成ページ
// router.get('/add', (req, res, next) => {
//   if (check(req, res, next)) { return };
//   res.render('timeKiller/add', { title: 'timeKiller/Add' });
// });

// //新規作成フォームの送信処理
// router.post('/add', (req, res, next) => {
//   if (check(req, res, next)) { return };
//   db.sequelize.sync().then(() => db.Markdata.create({
//       userId: req.session.login.id,
//       title: req.body.title,
//       content: req.body.content,
//     })
//       .then(model => {
//         res.redirect('/timeKiller');
//       })
//     );
// });

//プレイリスト用データ
let playlistData = {
  'check01': ['動画リンク','音楽リンク'],
  'check02': ['音楽リンク'],
  'check03': ['本（青空文庫）リンク'],
  'check04': ['ウェブラジオリンク'],
  'check05': ['ニュースリンク'],
  'check06': ['SNSリンク'],
  'check07': ['まとめサイトリンク'],
  'check08': ['ウィキランダムリンク'],
  'check09': ['なぞなぞ・クイズリンク'],
  'check10': ['心理テストリンク'],
  'check11': ['ゲーム（ボードゲーム）リンク'],
  'check12': ['名言集（ランダムでサイト提示）リンク'],
  'check13': ['名言作成 リンク'],
};

//プレイリストページ
router.get('/playlist', (req, res, next) => {
  var msg = "これはotherページです。"
    var data = {
        title: "Other",
        content: msg,
        data: playlistData,
        filename: 'data_item'
    }
    res.render('timeKiller/playlist', data);
});

//プレイリストフォームの送信処理
router.post('/playlist', (req, res, next) => {
  if (check(req, res, next)) { return }
  redirect('/timeKiller')
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

module.exports = router;
