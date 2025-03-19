const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'reviewed'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
