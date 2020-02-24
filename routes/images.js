const express = require('express');
const bodyParser = require('body-parser');

const Image = require('../models/image');

const router = new express.Router();

router.use(bodyParser.json());

router.route('/')
    .get(async function(req, res, next) {
      try {
        res.json(await Image.find(req.query).exec());
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

module.exports = router;
