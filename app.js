const express = require('express');
const path = require('path');
const logger = require('morgan');
const { BotService, capitalize } = require("./services/BotService");
const UserService = require("./services/UserService");

// The routes are organized per category in different files
/* Routes for bot management */
const botRouter = require('./routes/chatbot/api/v1/bots');
/* Routes for chat operations */
const chatRouter = require('./routes/chatbot/api/v1/chat');
/* Routes for user management */
const userRouter = require('./routes/chatbot/api/v1/users');
/* Route for graphical user interface */
const indexRouter = require('./routes/chatbot/api/v1/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/chatbot/api/v1/bots', botRouter);
app.use('/chatbot/api/v1/chat', chatRouter);
app.use('/chatbot/api/v1/users', userRouter);
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
