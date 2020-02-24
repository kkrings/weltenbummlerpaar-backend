const express = require('express');
const bodyParser = require('body-parser');

const DiaryEntry = require('../models/entry');

const router = new express.Router();

router.use(bodyParser.json());

router.route('/')
    .get(async function(req, res, next) {
      try {
        res.json(
            await DiaryEntry.find(req.query)
                .populate('images')
                .exec());
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
    });

module.exports = router;
