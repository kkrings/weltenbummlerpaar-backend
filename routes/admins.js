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

// user login via username and password; signs a new JSON web token
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      next(err);
    } else {
      if (user) {
        // sign and send new JSON web token
        const token = jsonwebtoken.sign(
            {_id: user._id}, config.jwtSecret, {expiresIn: 3600});

        res.json({success: true, token: token});
      } else {
        // wrong username or password
        res.json({success: false, token: ''});
      }
    }
  })(req, res, next);
});

module.exports = router;
