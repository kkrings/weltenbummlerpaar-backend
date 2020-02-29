const debug = require('debug')('weltenbummlerpaar-backend:server');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = require('../app');


// connect to MongoDB
const mongodbUri = process.env.MONGODBURI ||
    'mongodb://localhost:27017/weltenbummlerpaar';

connectDB(mongodbUri);

// listen to MongoDB connection errors
mongoose.connection.on(
    'error', console.error.bind(console, 'Data base connection error: '));

// get port from environment and store in Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// if possible, create HTTPS server, otherwise fall back to HTTP server
let server;

if (process.env.CERT && process.env.KEY) {
  const options = {
    cert: fs.readFileSync(process.env.CERT),
    key: fs.readFileSync(process.env.KEY),
  };

  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

// listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Connect to MongoDB.
 *
 * @param {string} uri
 *   MongoDB URI
 */
async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    debug(`Connected to ${uri}.`);
  } catch (error) {
    handleDBError(error);
  }
}

/**
 * Handle error on initial connection to MongoDB.
 *
 * @param {Error} error
 *   Error event
 */
function handleDBError(error) {
  console.error(`Failed to connect to ${mongodbUri}.`);
  console.error(error);
  process.exit(1);
}

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val
 *   Port number
 *
 * @return {number | string | boolean}
 *   Normalized port number
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Error} error
 *   Error event
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  let exit = false;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      exit = true;
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      exit = true;
      break;
    default:
      throw error;
  }

  if (exit) {
    process.exit(1);
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();

  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;

  debug(`Listening on ${bind}.`);
}
