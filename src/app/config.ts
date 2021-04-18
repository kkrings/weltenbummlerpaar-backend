/**
 * Configuration module
 *
 * In production mode, this application expects the following environment
 * variables to be set:
 *
 *   - JWTSECRET: secret for encrypting and decrypting JSON web tokens,
 *   - MONGODBURI: MongoDB's URI,
 *   - PORT: port number the HTTP(S) server should listen to,
 *   - SSLCERT: path to the SSL certificate, and
 *   - SSLKEY: path to the SSL private key.
 *
 * This module provides default values for most of the above variables for
 * development purposes.
 *
 * If SSLCERT or SSLKEY are not set, a HTTP server is created instead of a
 * HTTPS server. This should not be done in production.
 *
 * @module config
 */

import * as path from 'path'

/**
 * Application's configuration
 */
export interface Config {
  /**
   * Secret for encrypting and decrypting JSON web tokens
   */
  jwtSecret: string
  /**
   * MongoDB's URI
   */
  mongodbUri: string
  /**
   * If true check for and create indices when connection to the MongoDB.
   */
  mongodbAutoIndex: boolean
  /**
   * Port number the HTTP(s) server should list to
   */
  port: string
  /**
   * Folder static content is served from
   */
  publicFolder: string
  /**
   * JIMP configuration
   */
  jimp: JimpConfig
}

/**
 * JIMP configuration
 */
export interface JimpConfig {
  /**
   * Width uploaded images are resized to
   */
  imageWidth: number
  /**
   * Quality uploaded images are saved with
   */
  imageQuality: number
}

// default configuration values for development
const defaults = {
  jwtSecret: 'default JWT secret',
  mongodbUri: 'mongodb://localhost:27017/weltenbummlerpaar',
  port: '3000',
  publicFolder: path.join(__dirname, '../../src/public')
}

function getConfigValue (value: string | undefined, defaultValue: string): string {
  return value === undefined ? defaultValue : value
}

const config: Config = {
  jwtSecret: getConfigValue(process.env.JWTSECRET, defaults.jwtSecret),
  mongodbUri: getConfigValue(process.env.MONGODBURI, defaults.mongodbUri),
  mongodbAutoIndex: process.env.NODE_ENV === 'development',
  port: getConfigValue(process.env.PORT, defaults.port),
  publicFolder: path.resolve(getConfigValue(process.env.PUBLICFOLDER, defaults.publicFolder)),
  jimp: {
    imageWidth: 2500,
    imageQuality: 75
  }
}

/**
 * Applicaton's configuration
 */
export default config
