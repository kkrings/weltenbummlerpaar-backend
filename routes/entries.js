/**
 * Diary entry routes
 * @module routes/entries
 */

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

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

module.exports = router;
