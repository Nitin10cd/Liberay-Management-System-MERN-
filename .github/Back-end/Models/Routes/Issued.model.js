const mongoose = require('mongoose');

const IssuedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please provide a valid URL.'],
  },
  email: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Issued = mongoose.model('Issued', IssuedSchema);

module.exports = Issued;
