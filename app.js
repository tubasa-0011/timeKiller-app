var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
//ルート用のモジュールロード
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var helloRouter = require('./routes/hello');
var boardsRouter = require('./routes/boards');
var timeKillerRouter = require('./routes/timeKiller');
var marksRouter = require('./routes/marks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//機能の有効化
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//session用のデータ
var session_opt = {
  secret : 'keybord cat',
  resave : false,
  saeUninitialized : false,
  cookie : {maxAge:60*60*1000}
}
app.use(session(session_opt))
//アクセス用の use処理
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/boards', boardsRouter);
app.use('/hello', helloRouter);
app.use('/md', marksRouter);
app.use('/timeKiller', timeKillerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
