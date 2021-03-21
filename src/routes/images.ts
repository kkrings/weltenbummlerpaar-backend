/**
 * Image routes
 * @module routes/images
 */

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const config = require('../config');
const authenticate = require('../authenticate');
const Image = require('../models/image');


const router = new express.Router();

router.use(bodyParser.json());

const imageUpload = multer({dest: `${config.publicFolder}/images/`});

router.put('/:imageId', authenticate.authorizeJwt, imageUpload.single('image'),
    async function(req, res, next) {
      try {
        const image = await Image.findByIdAndUpdate(
            req.params.imageId, {$set: req.body}, {new: true}).exec();

        if (req.file) {
          // compress and rename uploaded image given its ID
          const imageManipulator = await jimp.read(req.file.path);

          imageManipulator
              .resize(config.jimp.imageWidth, jimp.AUTO)
              .quality(config.jimp.imageQuality)
              .write(path.join(req.file.destination, `${image._id}.jpg`));

          // remove uncompressed image from disk
          fs.unlinkSync(req.file.path);
        }

        res.json(image);
      } catch (err) {
        next(err);
      }
    });

module.exports = router;
