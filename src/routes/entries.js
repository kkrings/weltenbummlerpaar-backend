/**
 * Diary entry routes
 * @module routes/entries
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const jimp = require('jimp');

const authenticate = require('../authenticate');
const DiaryEntry = require('../models/entry');
const Image = require('../models/image');


const router = new express.Router();

router.use(bodyParser.json());

router.route('/')
    .get(async function(req, res, next) {
      try {
        const findEntries = DiaryEntry.find(
            req.query.filter, null, req.query.options);

        res.json(await findEntries.populate('images').exec());
      } catch (err) {
        next(err);
      }
    })
    .post(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        const diaryEntry = await (new DiaryEntry(req.body)).save();
        const findEntry = DiaryEntry.findById(diaryEntry._id);
        res.json(await findEntry.populate('images').exec());
      } catch (err) {
        next(err);
      }
    });

router.route('/:entryId')
    .get(async function(req, res, next) {
      try {
        const findEntry = DiaryEntry.findById(req.params.entryId);
        res.json(await findEntry.populate('images').exec());
      } catch (err) {
        next(err);
      }
    })
    .put(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        const updateEntry = DiaryEntry.findByIdAndUpdate(
            req.params.entryId, {$set: req.body}, {new: true});

        res.json(await updateEntry.populate('images').exec());
      } catch (err) {
        next(err);
      }
    })
    .delete(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        // remove diary entry
        const diaryEntry = await DiaryEntry.findByIdAndRemove(
            req.params.entryId).exec();

        const deleteImages = Image.deleteMany({
          _id: {$in: diaryEntry.images},
        });

        // remove diary entry's images from disk
        deleteImages.cursor().on('data', function(image) {
          fs.unlinkSync(`public/images/${image._id}.jpg`);
        });

        await deleteImages.exec();

        // send deleted diary entry
        res.json(diaryEntry);
      } catch (err) {
        next(err);
      }
    });

const imageUpload = multer({dest: 'public/images/'});

router.post('/:entryId/images', authenticate.authorizeJwt,
    imageUpload.single('image'), async function(req, res, next) {
      try {
        const image = new Image(req.body);

        // compress and rename uploaded image given its ID
        const imageManipulator = await jimp.read(req.file.path);

        imageManipulator
            .resize(2500, jimp.AUTO)
            .quality(75)
            .write(path.join(req.file.destination, `${image._id}.jpg`));

        // remove uncompressed image from disk
        fs.unlinkSync(req.file.path);

        // link image to diary entry
        await DiaryEntry.findByIdAndUpdate(
            req.params.entryId, {$push: {images: image._id}});

        res.json(await image.save());
      } catch (err) {
        next(err);
      }
    });

router.delete('/:entryId/images/:imageId', authenticate.authorizeJwt,
    async function(req, res, next) {
      try {
        const image = await Image.findByIdAndRemove(req.params.imageId).exec();

        // remove image from disk
        fs.unlinkSync(`public/images/${image._id}.jpg`);

        // unlink image from diary entry
        await DiaryEntry.findByIdAndUpdate(
            req.params.entryId, {$pull: {images: image._id}});

        res.json(image);
      } catch (err) {
        next(err);
      }
    });

module.exports = router;
