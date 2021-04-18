/**
 * Image routes
 * @module routes/images
 */

import path from 'path'
import fs from 'fs'
import express from 'express'
import jimp from 'jimp'
import multer from 'multer'

import * as authenticate from '../authenticate'
import config from '../config'
import Image from '../models/image'

const router = express.Router()

router.use(express.json())

const imageUpload = multer({ dest: `${config.publicFolder}/images/` })

router.route('/:imageId').put(authenticate.authorizeJwt, imageUpload.single('image'),
  async function (req, res, next) {
    try {
      const image = await Image.findByIdAndUpdate(
        req.params.imageId, { $set: req.body }, { new: true }).exec()

      if (image === null) {
        throw new Error(`An image with ID ${req.params.imageId} could not be found.`)
      }

      if (req.file !== undefined) {
        // compress and rename uploaded image given its ID
        const imageManipulator = await jimp.read(req.file.path)

        imageManipulator
          .resize(config.jimp.imageWidth, jimp.AUTO)
          .quality(config.jimp.imageQuality)
          .write(path.join(req.file.destination, `${image.id as string}.jpg`))

        // remove uncompressed image from disk
        fs.unlinkSync(req.file.path)
      }

      res.json(image)
    } catch (err) {
      next(err)
    }
  })

export default router
