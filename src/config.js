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

const path = require('path');


// default configuration values for development
const defaults = {
  jwtSecret: 'default JWT secret',
  mongodbUri: 'mongodb://localhost:27017/weltenbummlerpaar',
  port: '3000',
  publicFolder: path.join(__dirname, 'public'),
};

module.exports = {
  /**
   * Secret for encrypting and decrypting JSON web tokens
   */
  jwtSecret: process.env.JWTSECRET || defaults.jwtSecret,
  /**
   * MongoDB's URI
   */
  mongodbUri: process.env.MONGODBURI || defaults.mongodbUri,
  /**
   * If true check for and create indices when connection to the MongoDB.
   */
  mongodbAutoIndex: process.env.NODE_ENV === 'development',
  /**
   * Port number the HTTP(s) server should list to
   */
  port: process.env.PORT || defaults.port,
  /**
   * Folder static content is served from
   */
  publicFolder: path.resolve(
      process.env.PUBLICFOLDER || defaults.publicFolder),
  /**
   * JIMP configuration
   */
  jimp: {
    /**
     * Width uploaded images are resized to
     */
    imageWidth: 2500,
    /**
     * Quality uploaded images are saved with
     */
    imageQuality: 75,
  },
};
