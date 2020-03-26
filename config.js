/**
 * Configuration module
 * @module config
 */

module.exports = {
  jwtSecret: process.env.JWTSECRET || 'default JWT secret',
};
