const mongoose = require("mongoose");

const notification = new mongoose.Schema({
  date: {
    type: String,
    trim: true,
    //required: true,
  },
  time: {
    type: String,
    trim: true,
    //required: true,
  },
  title: {
    type: String,
    //required: true,
  },
  description: {
    type: String,
    //required: true,
  },
  name: {
    type: String,
    trim: true,
    default: "",
  },
  type: {
    type: String,
    // enum: ["Booking", "OutPatient", "Plans","Like","Admin"],
  },
  profilePic: {
    type: String,
    trim: true,
    default: "",
  },
  image: {
    type: String,
    trim: true,
    // default: "uploads/allude.png",
  },
  sendTo: {
    type: String,
    trim: true,
    enum: ["All", "Promoter", "Admin"],
  },
  users: {
    type: Array,
  },
  notificationType: {
    type: Array,
    // enum: ["Push_Notification", "Whatsapp", "SMS"],
  },
  logCreatedDate: {
    type: String,
    trim: true,
  },
  logModifiedDate: {
    type: String,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  seen: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("notifications", notification);
