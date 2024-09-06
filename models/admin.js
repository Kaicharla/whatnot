const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    ///required: "A name is required.",
  },
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: "An email address is required.",
  },
  phone: {
    type: String,
    trim: true,
    index: true,
    unique: true,
   // required: "A mobile number is required.",
  },
  address: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },
  permissions: {
    type: Array,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    default: "",
  },
  profilePicture: {
    type: String,
    //default: "uploads/profileAvatar.png",
  },
  status: {
    type: Boolean,
    default: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },
  adminName: {
    type: String,
    trim: true,
  },
  isLoggedIn: {
    type:Boolean,
    default: true,
    trim:true
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

module.exports = mongoose.model("Admin", admin);
