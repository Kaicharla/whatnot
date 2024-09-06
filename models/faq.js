const mongoose = require('mongoose');

const Faqs = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  logCreatedDate: {
    type: String,
    trim: true, 
  },
  logModifiedDate: {
    type: String,
    trim: true,
  },
});

const FAQ = mongoose.model('FAQ', Faqs);

module.exports = FAQ;
