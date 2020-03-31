/**
 * Image routes
 * @module routes/images
 */

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authenticate = require('../authenticate');
const Image = require('../models/image');


const router = new express.Router();

router.use(bodyParser.json());

router.route('/')
    .get(async function(req, res, next) {
      try {
        res.json(
            await Image.find(req.query.filter, null, req.query.options)
                .exec());
      } catch (err) {
        next(err);
      }
    });

router.route('/:imageId')
    .get(async function(req, res, next) {
      try {
        res.json(await Image.findById(req.params.imageId).exec());
      } catch (err) {
        next(err);
      }
    });

const imageUpload = multer({dest: 'public/images/'});

router.route('/upload')
    .post(
        authenticate.authorizeJwt,
        imageUpload.single('image'),
        async function(req, res, next) {
          try {
            const image = new Image(req.body);

            // rename uploaded image given its ID
            fs.renameSync(
                req.file.path,
                path.join(req.file.destination, `${image._id}.jpg`),
            );

            res.json(await image.save());
          } catch (err) {
            next(err);
          }
        },
    );

module.exports = router;
