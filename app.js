const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const entryRouter = require('./routes/entries');
const imageRouter = require('./routes/images');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/db/entries', entryRouter);
app.use('/db/images', imageRouter);

module.exports = app;
