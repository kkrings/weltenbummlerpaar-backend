/**
 * Application's entry point
 *
 * Here, the HTTP(S) server is started and the connection to the MongoDB
 * database is established.
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import debug from 'debug'
import mongoose from 'mongoose'

import config from './app/config'
import app from './app/app'

const debugLog = debug('weltenbummlerpaar-backend:server')

// connect to MongoDB
const mongodbUri = config.mongodbUri

connectDB(mongodbUri).then(undefined, error => handleDBError(error))

// listen to MongoDB connection errors
mongoose.connection.on('error', console.error.bind(console, 'Data base connection error: '))

// get port and store in Express
const port = normalizePort(config.port)
app.set('port', port)

// if possible, create HTTPS server, otherwise fall back to HTTP server
let server: http.Server

if (process.env.SSLCERT !== undefined && process.env.SSLKEY !== undefined) {
  const options = {
    cert: fs.readFileSync(process.env.SSLCERT),
    key: fs.readFileSync(process.env.SSLKEY)
  }

  server = https.createServer(options, app)
} else {
  server = http.createServer(app)
}

// listen on provided port, on all network interfaces
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Connect to MongoDB.
 *
 * @param uri
 *   MongoDB URI
 */
async function connectDB (uri: string): Promise<void> {
  await mongoose.connect(uri, {
    autoIndex: config.mongodbAutoIndex
  })

  debugLog(`Connected to ${uri}; auto index: ${config.mongodbAutoIndex ? 'true' : 'false'}`)
}

/**
 * Handle error on initial connection to MongoDB.
 *
 * @param error
 *   Error event
 */
function handleDBError (error: Error): void {
  console.error(`Failed to connect to ${mongodbUri}.`)
  console.error(error)
  process.exit(1)
}

/**
 * Normalize a port into a number, string, or false.
 *
 * @param val
 *   Port number
 *
 * @returns
 *   Normalized port number
 */
function normalizePort (val: string): number | string | boolean {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Convert number to string
 *
 * @param port
 *   Port number
 *
 * @returns
 *   Port number as string
 */
function portAsString (port: string | number | boolean): string {
  let result
  switch (typeof port) {
    case 'string':
      result = port
      break
    case 'number':
      result = `${port}`
      break
    case 'boolean':
      result = port ? 'true' : 'false'
      break
    default:
      result = ''
  }

  return result
}

/**
 * Event listener for HTTP server "error" event.
 *
 * @param error
 *   Error event
 */
function onError (error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${portAsString(port)}`

  // handle specific listen errors with friendly messages
  let exit = false
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`)
      exit = true
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`)
      exit = true
      break
    default:
      throw error
  }

  if (exit) {
    process.exit(1)
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening (): void {
  const addr = server.address()

  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${portAsString(addr?.port ?? port)}`

  debugLog(`Listening on ${bind}.`)
}
