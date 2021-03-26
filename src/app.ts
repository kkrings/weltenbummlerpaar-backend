/**
 * Application module
 *
 * In this module, the Express application is initialized, third-party
 * middleware is loaded, and routes are mounted.
 *
 * If the NODE_ENV environment variable is set to development, cross-origin
 * resource sharing [CORS](https://www.npmjs.com/package/cors/) is enabled.
 *
 * The routes provide the REST API for performing operations on the MongoDB
 * that stores admin users, diary entries, and images; the object modeling is
 * done via [Mongoose](https://mongoosejs.com/).
 *
 * @module app
 */

import debug from 'debug';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as authenticate from './authenticate';
import config from './config';
import adminRouter from './routes/admins';
import entryRouter from './routes/entries';
import imageRouter from './routes/images';


const logDebug = debug('weltenbummlerpaar-backend:app');

const app = express();

// third-party middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cookieParser());
app.use(authenticate.initialize());

if (app.get('env') === 'development') {
  logDebug('Enable CORS for development purposes.');
  app.use(cors());
}

// serve static files
logDebug(`Static files are served from ${config.publicFolder}.`);
app.use(express.static(config.publicFolder));

// routes
app.use('/db/admins', adminRouter);
app.use('/db/entries', entryRouter);
app.use('/db/images', imageRouter);

/**
 * The initialized Express application
 */
export default app;
