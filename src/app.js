/**
 * Application module
 *
 * In this module, the Express application is initialized, third-party
 * middleware is loaded, and routes are mounted.
 *
 * If the NODE_ENV environment variable is set to development, cross-origin
 * resource sharing ({@link https://www.npmjs.com/package/cors CORS}) is
 * enabled.
 *
 * The routes provide the REST API for performing operations on the MongoDB
 * that stores admin users, diary entries, and images; the object modeling is
 * done via {@link https://mongoosejs.com/ Mongoose}.
 *
 * @module app
 */

const debug = require('debug')('weltenbummlerpaar-backend:app');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const config = require('./config');
const authenticate = require('./authenticate');

const adminRouter = require('./routes/admins');
const entryRouter = require('./routes/entries');
const imageRouter = require('./routes/images');


const app = express();

// third-party middleware
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

// serve static files
debug(`Static files are served from ${config.publicFolder}.`);
app.use(express.static(config.publicFolder));

// routes
app.use('/db/admins', adminRouter);
app.use('/db/entries', entryRouter);
app.use('/db/images', imageRouter);

/**
 * The initialized Express application
 */
module.exports = app;
