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
  country: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
