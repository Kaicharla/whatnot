const mongoose = require("mongoose");

const promoter = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
   // required: "A name is required.",
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
   // unique: true,
    //required: "A mobile number is required.",
  },
  kyc:{
    type: String,
    trim: true,
    default:"not uploaded"
  },
  kycVerified:{
     type:Boolean,
     default:false,
     trim:true
  },
  kycStatus:{
    type:String,
    default:"pending"
  },
  kycReverificationStatus:{
         type:String,
         default:"not requested",
         enum:["not requested","requested","approved","rejected"]
  },
  rejectionReason:{
    type:String,
    trim:true
  },
  wallet: {
    type: Number,
    //required: true,
    min: 0,
    default:0
  },
  monthTarget:{
    type: Number,
    min: 0,
    default:5000
  },
  fcmToken:{
    type:String,
    trim:true
  },
  notification_bell:{
   type:Boolean,
   default:true,
   trim:true
  },
  gender:{
    type: String,
    trim: true
  },
  date_of_birth:{
   type:String
  },
  age:{
    type: Number
  },
  address: {
    type: String,
    trim: true,
  },
  storeName:{
   type: String,
   trim: true,
  },
  idNumber:{
     type:String,
     trim:true,
  },
  password: {
    type: String,
    trim: true,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },
  
  profilePic: {
    type: String,
    default:"fileStorage/promoters_images/avatar.jpg"
   
  },
  status: {
    type: Boolean,
    default: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },
  bankName:{
    type: String,
    trim:true,
    default:""
  },
  branchName:{
    type: String,
    trim:true,
    default:""
  },
  accountHolderName:{
    type: String,
    trim:true,
    default:""
  },

  accountNumber:{
    type: String,
    trim:true,
    default:""
  },
  IFSC:{
    type: String,
    trim:true,
    default:""
  },
  isLoggedIn:{
   type: Boolean,
   default:true,
   trim:true
  },
  kycUpdatedDate:{
    type: String,
    trim: true, 
  },
  kycUploadedDate:{
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
  
incentiveTarget:{
  type:Number,
  trim:true,
  default:25
}

});

module.exports = mongoose.model("Promoter", promoter);
