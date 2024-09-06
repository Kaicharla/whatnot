const mongoose = require("mongoose");

const contactUs = new mongoose.Schema({
    officeName: {
    type: String,
    trim: true,
  },
  officeEmail: {
    type: String,
    trim: true,
  },
  officePhonenumber: {
    type: String,
    trim: true,
  },
  officeAltPhonenumber: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
  location: {
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
module.exports = mongoose.model("ContactUs", contactUs);


