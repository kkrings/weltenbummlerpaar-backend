/**
 * Authentication module
 * @module authenticate
 */

const passport = require('passport');

const User = require('./models/user');


// local strategy
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Initialize passport.
 *
 * @return {function}
 *   Passport's initialization middleware.
 */
exports.initialize = function() {
  return passport.initialize();
};
