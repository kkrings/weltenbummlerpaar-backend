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
  tags: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
