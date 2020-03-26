/**
 * User authentication routes
 * @module router/users
 */

const express = require('express');
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const passport = require('passport');

const config = require('../config');


const router = new express.Router();

router.use(bodyParser.json());

/**
 * Send the admin user's JSON web token.
 *
 * @param {Object} req
 *   The request is expected to have the `user` property set, which holds the
 *   successfully authenticated admin user.
 * @param {Object} res
 *   The JSON response has the properties `success` and `token`. The former is
 *   a positive boolean that indicates that the admin user's authentication was
 *   successful. The latter holds the admin user's JSON web token.
 */
function sendJwt(req, res) {
  const token = jsonwebtoken.sign(
      {_id: req.user._id}, config.jwtSecret, {expiresIn: 3600},
  );

  res.json({success: true, token: token});
}

// user login via username and password; signs a new JSON web token
router.post('/login',
    passport.authenticate('local', {session: false}),
    sendJwt,
);

module.exports = router;
