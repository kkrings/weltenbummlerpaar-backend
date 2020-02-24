#!/usr/bin/env node

const mongoose = require('mongoose');
const yargs = require('yargs');

const DiaryEntry = require('../models/entry');
const Image = require('../models/image');

/**
 * Connect to data base.
 */
async function connect() {
  const mongooseUrl = 'mongodb://localhost:27017/weltenbummlerpaar';

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(mongooseUrl, mongooseOptions);
    console.log(`Connected to ${mongooseUrl}.`);
  } catch (err) {
    console.error('Cannot connect to database.');
    console.error(err);
  }
}

/**
 * Save new diary entry to data base.
 *
 * @param {Object} entry Diary entry
 */
async function createEntry(entry) {
  const diaryEntry = new DiaryEntry(entry);

  try {
    await connect();
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
 * @param {Object} image Image
 */
async function createImage(image) {
  const newImage = new Image(image);

  try {
    await connect();
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
        country: {
          describe: 'Diary entry\'s country name',
          demandOption: true,
        },
        images: {
          type: 'array',
          describe: 'Diary\'s image IDs',
        },
      });
    }, (entry) => {
      createEntry(entry);
    })
    .command('image [options]', 'Save new image.', (yargs) => {
      yargs.options({
        description: {
          describe: 'Image\'s description',
          demandOption: true,
        },
      });
    }, (image) => {
      createImage(image);
    })
    .argv;
