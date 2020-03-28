const debug = require('debug')('weltenbummlerpaar-backend:app');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const authenticate = require('./authenticate');

const adminRouter = require('./routes/admins');
const entryRouter = require('./routes/entries');
const imageRouter = require('./routes/images');


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cookieParser());
app.use(authenticate.initialize());

if (app.get('env') === 'development') {
  debug('Enable CORS for development purposes.');
  app.use(require('cors')());
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/db/admins', adminRouter);
app.use('/db/entries', entryRouter);
app.use('/db/images', imageRouter);

module.exports = app;
