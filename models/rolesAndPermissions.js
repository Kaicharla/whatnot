const mongoose = require("mongoose");

const role = new mongoose.Schema({
  date: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: true,
  },
  permissions: {
    type: Array,
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
  logCreatedDate: {
    type: String,
    trim: true,
  },
  logModifiedDate: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Roles", role);
