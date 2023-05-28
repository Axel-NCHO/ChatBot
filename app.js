var express = require('express');
var path = require('path');
var logger = require('morgan');
const { BotService, capitalize } = require("./services/BotService");
const UserService = require("./services/UserService");

const botsRouter = require('./routes/chatbot/api/v1/bots');
const chatRouter = require('./routes/chatbot/api/v1/chat');
const usersRouter = require('./routes/chatbot/api/v1/users');
const indexRouter = require('./routes/chatbot/api/v1/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/chatbot/api/v1/bots', botsRouter);
app.use('/chatbot/api/v1/chat', chatRouter);
app.use('/chatbot/api/v1/users', usersRouter);
app.use('/chatbot/api/v1', indexRouter);

app.set('capitalize', capitalize);

UserService.create()
    .then((instance) => {
        app.set('UserService', instance);
    });
BotService.create()
    .then((instance) => {
        app.set('BotService', instance);
    });

module.exports = app;
