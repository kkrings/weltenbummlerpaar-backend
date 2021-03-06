/**
 * User authentication routes
 * @module routes/admins
 */

import express from 'express'
import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'
import passport from 'passport'

import config from '../config'

const router = express.Router()

router.use(express.json())

// user login via username and password; signs a new JSON web token
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err !== null) {
      next(err)
    } else {
      if (user instanceof mongoose.Document) {
        // sign and send new JSON web token
        const token = jsonwebtoken.sign(
          { _id: user._id }, config.jwtSecret, { expiresIn: 3600 })

        res.json({ success: true, token: token })
      } else {
        // wrong username or password
        res.json({ success: false, token: '' })
      }
    }
  })(req, res, next)
})

export default router
