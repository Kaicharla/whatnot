const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  aboutUs: {
    type: String,
    // required: true
  },
  services: [{
    type: String,
   // required: true
  }],
  businessHours: {
    type: String,
  //  required: true
  },
  socialMediaLinks: {
    type: Map, // Map data type for storing key-value pairs
    of: String // Value type for the map
  },
  contact: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  photos: [{
    type: String // Assuming photo URLs are stored as strings
  }],
  addonServices: [{
    type: String
  }],
  curriculum: {
    type: String
  },
  level: {
    type: String,
   // enum: ['Beginner', 'Intermediate', 'Advanced'] // Assuming levels are predefined
  },
  type: {
    type: String,
   // enum: ['Beginner', 'Intermediate', 'Advanced'] // Assuming levels are predefined
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
