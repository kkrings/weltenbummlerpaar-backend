/**
 * Diary entry routes
 * @module routes/entries
 */

import path from 'path'
import fs from 'fs'
import express from 'express'
import mongoose from 'mongoose'
import jimp from 'jimp'
import multer from 'multer'

import * as authenticate from '../authenticate'
import config from '../config'
import DiaryEntry from '../models/entry'
import Image from '../models/image'

const router = express.Router()

router.use(express.json())

router.route('/')
  .get(async function (req, res, next) {
    try {
      const { skip, limit, ...filter } = req.query

      let findEntries = DiaryEntry.find(filter).sort({ createdAt: -1 })

      if (typeof skip === 'string') {
        findEntries = findEntries.skip(parseInt(skip))
      }

      if (typeof limit === 'string') {
        findEntries = findEntries.limit(parseInt(limit))
      }

      res.json(await findEntries.populate('images').exec())
    } catch (err) {
      next(err)
    }
  })
  .post(authenticate.authorizeJwt, async function (req, res, next) {
    try {
      const diaryEntry = await DiaryEntry.create(req.body)
      const findEntry = DiaryEntry.findById(diaryEntry._id)
      res.json(await findEntry.populate('images').exec())
    } catch (err) {
      next(err)
    }
  })

router.route('/count').get(async function (req, res, next) {
  try {
    const count = req.query !== undefined
      ? DiaryEntry.countDocuments(req.query)
      : DiaryEntry.estimatedDocumentCount()

    res.json(await count.exec())
  } catch (err) {
    next(err)
  }
})

router.route('/:entryId')
  .get(async function (req, res, next) {
    try {
      const findEntry = DiaryEntry.findById(req.params.entryId)
      res.json(await findEntry.populate('images').exec())
    } catch (err) {
      next(err)
    }
  })
  .put(authenticate.authorizeJwt, async function (req, res, next) {
    try {
      const updateEntry = DiaryEntry.findByIdAndUpdate(
        req.params.entryId, { $set: req.body }, { new: true })

      res.json(await updateEntry.populate('images').exec())
    } catch (err) {
      next(err)
    }
  })
  .delete(authenticate.authorizeJwt, async function (req, res, next) {
    try {
      // remove diary entry
      const diaryEntry = await DiaryEntry.findByIdAndRemove(
        req.params.entryId).exec()

      if (diaryEntry === null) {
        throw new Error(`A diary entry with ID ${req.params.entryId} could not be found.`)
      }

      const deleteImages = Image.deleteMany({
        _id: { $in: diaryEntry.images }
      })

      // remove diary entry's images from disk
      deleteImages.cursor().on('data', function (image: mongoose.Document) {
        fs.unlinkSync(`${config.publicFolder}/images/${image.id as string}.jpg`)
      })

      await deleteImages.exec()

      // send deleted diary entry
      res.json(diaryEntry)
    } catch (err) {
      next(err)
    }
  })

const imageUpload = multer({ dest: `${config.publicFolder}/images/` })

router.route('/:entryId/images').post(authenticate.authorizeJwt,
  imageUpload.single('image'), async function (req, res, next) {
    try {
      const image = new Image(req.body)

      // compress and rename uploaded image given its ID
      const imageManipulator = await jimp.read(req.file.path)

      imageManipulator
        .resize(config.jimp.imageWidth, jimp.AUTO)
        .quality(config.jimp.imageQuality)
        .write(path.join(req.file.destination, `${image.id as string}.jpg`))

      // remove uncompressed image from disk
      fs.unlinkSync(req.file.path)

      // link image to diary entry
      await DiaryEntry.findByIdAndUpdate(
        req.params.entryId, { $push: { images: image._id } })

      res.json(await image.save())
    } catch (err) {
      next(err)
    }
  })

router.route('/:entryId/images/:imageId').delete(authenticate.authorizeJwt,
  async function (req, res, next) {
    try {
      const image = await Image.findByIdAndRemove(req.params.imageId).exec()

      if (image === null) {
        throw new Error(`An image with ID ${req.params.imageId} could not be found.`)
      }

      // remove image from disk
      fs.unlinkSync(`${config.publicFolder}/images/${image.id as string}.jpg`)

      // unlink image from diary entry
      await DiaryEntry.findByIdAndUpdate(
        req.params.entryId, { $pull: { images: image._id } })

      res.json(image)
    } catch (err) {
      next(err)
    }
  })

export default router
