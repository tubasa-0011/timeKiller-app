const express = require('express');
const router = express.Router();
const db = require('../models/index');

//indexの処理
router.get('/', (req, res, next) => {
  const nm = req.query.name;
  const ml = req.query.mail;
  db.User.findAll().then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    }
    res.render('users/index', data);
  });
});

// add処理
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Users/Add',
    content:"",
    form: new db.User(),
    err: null
  }
  res.render('users/login', data);
});
 
router.post('/add', (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
  };
  db.sequelize.sync()
    .then(() => db.User.create(form)
      .then(usr => {
        res.redirect('/users/login');
      })
      .catch(err => {
        var data = {
          title: 'Users/login',
          form: form,
          err: err
        }
        res.render('users/login', data);
      })
    )
});

//editの処理
router.get('/edit', (req, res, next) => {
  db.User.findByPk(req.query.id).then(usr => {
    var data = {
      title: 'Users/Edit',
      form: usr
    }
    res.render('users/edit', data);
  });
});

router.post('/edit', (req, res, next) => {
  db.sequelize.sync().then(() => db.User.update({
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  }, {
    where: { id: req.body.id }
  })).then(usr => {
    res.redirect('/users');
  });
});

//deleteの処理
router.get('/delete', (req, res, next) => {
  db.User.findByPk(req.query.id).then(usr => {
    var data = {
      title: 'Users/Delete',
      form: usr
    }
    res.render('users/delete', data);
  });
});

router.post('/delete', (req, res, next) => {
  db.sequelize.sync().then(() => db.User.destroy({
    where: { id: req.body.id }
  })).then(usr => {
    res.redirect('/users');
  });
});

//loginの処理
router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content:"",
    form: new db.User(),
    err: null
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  db.User.findOne({
    where: {
      name: req.body.name,
      pass: req.body.pass,
    }
  }).then(usr => {
    if (usr != null) {
      req.session.login = usr;
      let back = req.session.back;
      if (back == null) {
        back = '/';
      }
      res.redirect(back);
    }else{
      var data = {
        title: 'User/Login',
        content: '名前かパスワードに問題があります。再入力してください。'
      }
      res.render('users/login', data);
    }
  })
});

module.exports = router;
