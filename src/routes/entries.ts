/**
 * Diary entry routes
 * @module routes/entries
 */

import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as multer from 'multer';
import * as jimp from 'jimp';

import * as authenticate from '../authenticate';
import config from '../config';
import DiaryEntry from '../models/entry';
import Image from '../models/image';


const router = express.Router();

router.use(express.json());

router.route('/')
    .get(async function(req, res, next) {
      try {
        const {skip, limit, ...filter} = req.query;

        let findEntries = DiaryEntry.find(filter).sort({createdAt: -1});

        if (skip) {
          findEntries = findEntries.skip(parseInt(skip as string));
        }

        if (limit) {
          findEntries = findEntries.limit(parseInt(limit as string));
        }

        res.json(await findEntries.populate('images').exec());
      } catch (err) {
        next(err);
      }
    })
    .post(authenticate.authorizeJwt, async function(req, res, next) {
      try {
        const diaryEntry = await DiaryEntry.create(req.body);
        const findEntry = DiaryEntry.findById(diaryEntry._id);
        res.json(await findEntry.populate('images').exec());
      } catch (err) {
        next(err);
      }
    });

router.get('/count', async function(req, res, next) {
  try {
    const count = req.query ?
      DiaryEntry.countDocuments(req.query) :
      DiaryEntry.estimatedDocumentCount();

    res.json(await count.exec());
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
        deleteImages.cursor().on('data', function(image: mongoose.Document) {
          fs.unlinkSync(`${config.publicFolder}/images/${image._id}.jpg`);
        });

        await deleteImages.exec();

        // send deleted diary entry
        res.json(diaryEntry);
      } catch (err) {
        next(err);
      }
    });

const imageUpload = multer({dest: `${config.publicFolder}/images/`});

router.post('/:entryId/images', authenticate.authorizeJwt,
    imageUpload.single('image'), async function(req, res, next) {
      try {
        const image = new Image(req.body);

        // compress and rename uploaded image given its ID
        const imageManipulator = await jimp.read(req.file.path);

        imageManipulator
            .resize(config.jimp.imageWidth, jimp.AUTO)
            .quality(config.jimp.imageQuality)
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
        fs.unlinkSync(`${config.publicFolder}/images/${image._id}.jpg`);

        // unlink image from diary entry
        await DiaryEntry.findByIdAndUpdate(
            req.params.entryId, {$pull: {images: image._id}});

        res.json(image);
      } catch (err) {
        next(err);
      }
    });

export default router;
