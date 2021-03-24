/**
 * Image routes
 * @module routes/images
 */

import * as path from 'path'
import * as fs from 'fs';
import * as express from 'express';
import * as multer from 'multer';
import * as jimp from 'jimp';

import * as authenticate from '../authenticate';
import config from '../config';
import Image from '../models/image';


const router = express.Router();

router.use(express.json());

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

export default router;
