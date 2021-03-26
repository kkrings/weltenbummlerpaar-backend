/**
 * Admin authentication module
 *
 * This application supports two authentication strategies: local or via a JSON
 * web token. The former is based on a username and password. Every time an
 * admin user uses the local authentication strategy a new JSON web token is
 * signed for this user.
 *
 * Both authentication strategies are implemented via {@link
 * https://www.npmjs.com/package/passport Passport}.
 *
 * @module authenticate
 */

import passport from 'passport';
import passportJwt from 'passport-jwt';

import { Handler } from 'express';
import { Document } from 'mongoose';

import config from './config';
import Admin from './models/admin';


/**
 * Verify JSON web token.
 *
 * The `token` is expected to hold the ID of an admin user. The ID is used to
 * search for the corresponding admin user in the underlying MongoDB database.
 *
 * @param token
 *   JSON web token
 * @param done
 *   Errors or the found admin user are passed to this callback function.
 */
async function verifyJwt(token: Document, done: passportJwt.VerifiedCallback): Promise<void> {
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
 * bearer token. The strategy expects an environment variable JWTSECRET that
 * holds a secret for encrypting and decrypting the JSON web token.
 *
 * @return
 *   JSON web token strategy instance
 */
function createJwtStrategy(): passportJwt.Strategy {
  const options = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  return new passportJwt.Strategy(options, verifyJwt);
}

// local strategy
passport.use(Admin.createStrategy());
// JSON web token strategy
passport.use(createJwtStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

/**
 * Initialize passport.
 *
 * @return
 *   Passport's initialization middleware.
 */
export const initialize = (): Handler => passport.initialize();

/**
 * Authorize admin user via JSON web token.
 */
export const authorizeJwt = passport.authenticate('jwt', {session: false});
