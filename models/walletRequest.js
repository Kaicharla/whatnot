const mongoose = require("mongoose");

const walletRequest = new mongoose.Schema({
  date: {
    type: String,
    trim: true,
    required: true,
  },
  time: {
    type: String,
    trim: true,
    required: true,
  },
  transactionId: {
    type: String,
    trim: true,
 //   index: true,
   // required: true,
   // ref: "Doctor",
  },
  promoterName: {
    type: String,
    trim: true,
    //required: true,
  },
  amount: {
    type: Number,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  transactionId: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid",'rejected'],
    default: "unpaid",
  },
  reason:{
    type:String,
    trim:true
  },
  promoterId: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("WalletRequests", walletRequest);
