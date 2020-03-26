/**
 * Admin authentication module
 * @module authenticate
 */

const passport = require('passport');

const Admin = require('./models/admin');


// local strategy
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

/**
 * Initialize passport.
 *
 * @return {function}
 *   Passport's initialization middleware.
 */
exports.initialize = function() {
  return passport.initialize();
};
