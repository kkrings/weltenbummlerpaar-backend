/**
 * User authentication routes
 * @module router/users
 */

const debug = require('debug')('weltenbummlerpaar-backend:users');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


const router = new express.Router();

router.use(bodyParser.json());

router.post('/login',
    passport.authenticate('local', {session: false}),
    function(req, res) {
      debug(req.user);
      res.end('Login was successful.');
    },
);

module.exports = router;
