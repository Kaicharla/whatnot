const mongoose = require('mongoose');

// Define the schema for sales data
const salesSchema = new mongoose.Schema({
  promoterId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  brandName: {
    type: String,
   // required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  categoryName: {
    type: String,
    //required: true
  },
  productName: {
    type: String,
    //required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    
  },
  incentive: {
    type: Number,
    required: true,
    
  },
  serialNumber: {
    type: String,
   
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  priceMatch: {
    type: Boolean,
    default: false,
    //required:true
  },
  invoicePath: {
    type: String
  },
  priceMatchScreenshotPath: {
     type: String
  },
  status:{
    type:String,
    default:"pending"
  },
  reason:{
    type:String,
    trim:true
  },
  customerName: {
    type: String,
    //required: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  logCreatedDate: {
    type: String,
    trim: true,
  },
  logModifiedDate: {
    type: String,
    trim: true,
  },
  sellingPrice:{
    type:Number,
    required: true
  }

});

// Create a model based on the schema
const Sale = mongoose.model('Sale', salesSchema);

module.exports = Sale;
