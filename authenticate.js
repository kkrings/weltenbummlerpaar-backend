/**
 * Admin authentication module
 * @module authenticate
 *
 * The application supports two authentication strategies: admin users can
 * either authenticate themselves with their username and password (local
 * authentication strategy) or via a JSON web token. Every time an admin user
 * uses the local authentication strategy a new JSON web token is signed for
 * this user.
 */

const passport = require('passport');
const passportJwt = require('passport-jwt');

const config = require('./config');
const Admin = require('./models/admin');


/**
 * Verify JSON web token.
 *
 * The `token` is expected to hold the ID of an admin user. The ID is used to
 * search for the corresponding admin user in the underlying MongoDB database.
 *
 * @param {Object} token
 *   JSON web token
 * @param {callback} done
 *   Errors or the found admin user are passed to this callback function.
 */
async function verifyJwt(token, done) {
  try {
    const admin = await Admin.findById(token._id).exec();

    if (admin) {
      done(null, admin);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
}

/**
 * Create JSON web token strategy.
 *
 * The JSON web token will be extracted from the authentication header as a
 * bearer token. The strategy expects an environment variable `JWTSECRET` that
 * holds a secret for encrypting and decrypting the JSON web token.
 *
 * @return {Object}
 *   JSON web token strategy instance
 */
function createJwtStrategy() {
  const options = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  return new passportJwt.Strategy(options, verifyJwt);
}

// local strategy
passport.use(Admin.createStrategy());
// JSON web token strategy
passport.use(createJwtStrategy);

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
