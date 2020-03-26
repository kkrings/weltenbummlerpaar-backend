/**
 * Configuration module
 * @module config
 */

// default configuration values
const jwtSecret = 'default JWT secret';
const mongodbUri = 'mongodb://localhost:27017/weltenbummlerpaar';
const port = '3000';

module.exports = {
  jwtSecret: process.env.JWTSECRET || jwtSecret,
  mongodbUri: process.env.MONGODBURI || mongodbUri,
  port: process.env.PORT || port,
};
