/**
 * Application module
 * @module app
 *
 * In this module, the actual Express application is initialized and exported,
 * third-party middleware like {@link https://www.npmjs.com/package/morgan
 * morgan} for logging is loaded, and routes are mounted.
 *
 * The routes provide the REST API for performing operations on the MongoDB
 * that stores admin users, diary entries, and images:
 * @see module:routes/admins
 * @see module:routes/entries
 * @see module:routes/images
 *
 * The object modeling is done via {@link https://mongoosejs.com/ Mongoose}:
 * @see module:models/admin
 * @see module:models/entry
 * @see module:models/image
 *
 * Note that if the `NODE_ENV` environment variable is set to `development`,
 * cross-origin resource sharing ({@link https://www.npmjs.com/package/cors
 * CORS}) is enabled.
 */

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
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/db/admins', adminRouter);
app.use('/db/entries', entryRouter);
app.use('/db/images', imageRouter);

module.exports = app;
