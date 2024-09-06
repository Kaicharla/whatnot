const mongoose = require("mongoose");

const wallet = new mongoose.Schema({
 amount:{
    type:Number,
    trim:true
 },

  date: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "Booking",
  },
  bookingNo: {
    type: String,
    trim: true,
  },
  rewardCoins: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    // default: "",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "Doctor",
  },
  doctorName: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "User",
  },
  userName: {
    type: String,
    trim: true,
  },
  // status: {
  //   type: Boolean,
  //   default: true,
  // },
  status: {
    type: String,
    enum: ["credit", "debit"],
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

module.exports = mongoose.model("Wallets", wallet);

// usedFor: {
//   type: String,
//   enum:["Doctor","Booking"],
//   trim: true,
// },
