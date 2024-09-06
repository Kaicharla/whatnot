const mongoose = require("mongoose");

const otp = new mongoose.Schema(
  {
    otp: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      trim: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: {
        expireAfterSeconds: 600,
      },
    },
    logCreatedDate: {
      type: String,
      trim: true,
    },
    logModifiedDate: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("otps", otp);
