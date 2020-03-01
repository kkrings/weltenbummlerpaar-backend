#!/usr/bin/env node

const mongoose = require('mongoose');
const yargs = require('yargs');

const DiaryEntry = require('../models/entry');
const Image = require('../models/image');

/**
 * Connect to data base.
 *
 * @param {string} uri
 *   MongoDB URI
 */
async function connect(uri) {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log(`Connected to ${uri}.`);
  } catch (err) {
    console.error('Cannot connect to database.');
    console.error(err);
  }
}

/**
 * Save new diary entry to data base.
 *
 * @param {string} uri
 *   MongoDB URI
 * @param {Object} entry
 *   Diary entry
 */
async function createEntry(uri, entry) {
  const diaryEntry = new DiaryEntry(entry);

  try {
    await connect(uri);
    await diaryEntry.save();
    console.log('Diary entry has been saved.');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Diary entry could not been saved.');
    console.error(err);
  }
}

/**
 * Save new image to data base.
 *
 * @param {string} uri
 *   MongoDB URI
 * @param {Object} image Image
 */
async function createImage(uri, image) {
  const newImage = new Image(image);

  try {
    await connect(uri);
    await newImage.save();
    console.log('Image has been saved.');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Image could not been saved.');
    console.error(err);
  }
}

// command-line arguments
yargs
    .usage('Usage: $0 <command> [options]')
    .options({
      uri: {
        describe: 'MongoDB URI',
        default: 'mongodb://localhost:27017/weltenbummlerpaar',
      },
    })
    .command('entry [options]', 'Save new diary entry.', (yargs) => {
      yargs.options({
        title: {
          describe: 'Diary entry\'s title',
          demandOption: true,
        },
        body: {
          describe: 'Diary entry\'s body',
          demandOption: true,
        },
        locationName: {
          describe: 'Diary entry\'s location name',
          demandOption: true,
        },
        images: {
          type: 'array',
          describe: 'Diary\'s image IDs',
        },
        tags: {
          type: 'array',
          describe: 'Diary\'s search tags',
        },
      });
    }, (args) => {
      createEntry(args.uri, {
        title: args.title,
        body: args.body,
        locationName: args.locationName,
        images: args.images,
        tags: args.tags,
      });
    })
    .command('image [options]', 'Save new image.', (yargs) => {
      yargs.options({
        description: {
          describe: 'Image\'s description',
          demandOption: true,
        },
      });
    }, (args) => {
      createImage(args.uri, {
        description: args.description,
      });
    })
    .argv;
