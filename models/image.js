const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  description: String,
}, {
  timestamps: true,
});

model.exports = mongoose.model('Image', imageSchema);
