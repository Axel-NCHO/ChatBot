var createError = require('http-errors');
var express = require('express');
const sessions = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");
const JSONC = require("jsonc");
const RiveScript = require("rivescript");
const { BotService, capitalize } = require("./services/BotService");
const UserService = require("./services/UserService");

var indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const ONE_DAY = 1_000 * 60 * 60 * 24;    // 24 hours (in milliseconds) : cookie expiry time
app.use(sessions({
    secret: randomKeyOfLength(10),
    saveUninitialized: true,
    cookie: {maxAge: ONE_DAY},
    resave: false
}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/chat', chatRouter);

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

function randomKeyOfLength(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

app.set('capitalize', capitalize);

let dbDataString = fs.readFileSync("./models/db.json", {encoding: "utf-8", flag: 'r'});
let dbDataObject = JSONC.parse(dbDataString);

UserService.create()
    .then((instance) => {
        app.set('UserService', instance);
    });
BotService.create()
    .then((instance) => {
        app.set('BotService', instance);
    });

module.exports = app;
