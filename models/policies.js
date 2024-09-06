const mongoose = require("mongoose");

const policy = new mongoose.Schema({
  aboutUs: {
    type: String,
    trim: true,
  },
  privacyPolicy: {
    type: String,
    trim: true,
  },
  claimPolicy: {
    type: String,
    trim: true,
  },
  refundPolicy: {
    type: String,
    trim: true,
  },
  termsCondition: {
    type: String,
    trim: true,
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
module.exports = mongoose.model("Policies", policy);