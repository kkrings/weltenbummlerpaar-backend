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

// default configuration values for development
const defaults = {
  jwtSecret: 'default JWT secret',
  mongodbUri: 'mongodb://localhost:27017/weltenbummlerpaar',
  port: '3000',
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
   * Port number the HTTP(s) server should list to
   */
  port: process.env.PORT || defaults.port,
};
