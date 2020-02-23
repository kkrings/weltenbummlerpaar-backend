const debug = require('debug')('weltenbummlerpaar-backend:server');
const mongoose = require('mongoose');
const http = require('http');

const app = require('../app');


// connect to MongoDB
const mongooseUrl = 'mongodb://localhost:27017/weltenbummlerpaar';

const mongooseOptions = {
  // useCreateIndex: true,
  // useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongooseUrl, mongooseOptions).then(
    () => debug(`Connected to ${mongooseUrl}.`),
    (err) => console.error(err));

// get port from environment and store in Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// create HTTP server
const server = http.createServer(app);

// listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
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
