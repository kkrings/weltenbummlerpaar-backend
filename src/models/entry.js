/**
 * Diary entry model
 * @module models/entry
 */

const mongoose = require('mongoose');


const diaryEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  }],
  tags: {
    type: [String],
    index: true,
  },
}, {
  timestamps: true,
});

diaryEntrySchema.index({createdAt: -1});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
