const mongoose = require('mongoose');

// Define the KYC schema
const kycSchema = new mongoose.Schema({
  promoterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  path: {
    type: String
  },
  status:{
   type:String,
   default:"pending",
   trim:true
  },
  rejection:{
       type:String,
       default:null,
       trim:true
  }
  ,
 
  identification: {
    type: String,
   
  },
  addressProof: {
    type: String,
   
  },
  logCreatedDate: {
    type: String,
    trim: true,
  },
  logModifiedDate: {
    type: String,
    trim: true,
  },
  // Add more fields as needed for other KYC documents
  // Example: proofOfIncome, passportPhoto, etc.
});

// Create the KYC model
const KYC = mongoose.model('KYC', kycSchema);

module.exports = KYC;
