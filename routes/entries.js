const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const DiaryEntry = require('../models/entry');

const router = new express.Router();

router.use(bodyParser.json());

router.route('/')
    .get(async function(req, res, next) {
      try {
        res.json(
            await DiaryEntry.find(req.query.filter, null, req.query.options)
                .populate('images')
                .exec());
      } catch (err) {
        next(err);
      }
    })
    .post(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        let diaryEntry = new DiaryEntry(req.body);
        diaryEntry = await diaryEntry.save();

        res.json(
            await DiaryEntry.findById(diaryEntry._id)
                .populate('images')
                .exec());
      } catch (err) {
        next(err);
      }
    })
    .delete(authenticate.authorizeJwt, async function(_req, res, next) {
      try {
        res.json(await DiaryEntry.deleteMany({}).exec());
      } catch (err) {
        next(err);
      }
    });

router.route('/:entryId')
    .get(async function(req, res, next) {
      try {
        res.json(
            await DiaryEntry.findById(req.params.entryId)
                .populate('images')
                .exec());
      } catch (err) {
        next(err);
      }
    })
    .put(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        res.json(
            await DiaryEntry.findByIdAndUpdate(
                req.params.entryId, {$set: req.body}, {new: true},
            )
                .populate('images')
                .exec());
      } catch (err) {
        next(err);
      }
    })
    .delete(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        res.json(
            await DiaryEntry.findByIdAndRemove(req.params.entryId)
                .populate('images')
                .exec());
      } catch (err) {
        next(err);
      }
    });

module.exports = router;
