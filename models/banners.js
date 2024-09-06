const mongoose = require("mongoose");
const banner = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
 
  description: {
    type: String,
    trim: true,
  },
 
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
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
module.exports = mongoose.model("banners", banner);
