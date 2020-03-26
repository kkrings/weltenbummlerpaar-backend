const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const authenticate = require('./authenticate');

const userRouter = require('./routes/users');
const entryRouter = require('./routes/entries');
const imageRouter = require('./routes/images');


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cookieParser());
app.use(authenticate.initialize());

app.use('/db/users', userRouter);
app.use('/db/entries', entryRouter);
app.use('/db/images', imageRouter);

module.exports = app;
