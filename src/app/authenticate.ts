/**
 * Admin authentication module
 *
 * This application supports two authentication strategies: local or via a JSON
 * web token. The former is based on a username and password. Every time an
 * admin user uses the local authentication strategy a new JSON web token is
 * signed for this user.
 *
 * Both authentication strategies are implemented via
 * [Passport](https://www.npmjs.com/package/passport/).
 *
 * @module authenticate
 */

import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import passportJwt from 'passport-jwt'

import config from './config'
import Admin from './models/admin'

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
function verifyJwt (token: mongoose.Document, done: passportJwt.VerifiedCallback): void {
  Admin.findById(token._id).exec().then(
    admin => {
      if (admin !== null) {
        done(null, admin)
      } else {
        done(null, false)
      }
    },
    err => done(err, false))
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
function createJwtStrategy (): passportJwt.Strategy {
  const options = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
  }

  return new passportJwt.Strategy(options, verifyJwt)
}

// local strategy
passport.use(Admin.createStrategy())
// JSON web token strategy
passport.use(createJwtStrategy())

passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())

/**
 * Initialize passport.
 *
 * @return
 *   Passport's initialization middleware.
 */
export const initialize = (): express.Handler => passport.initialize()

/**
 * Authorize admin user via JSON web token.
 */
export const authorizeJwt = passport.authenticate('jwt', { session: false })
