const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for targets and bonuses
const TargetsAndBonusesSchema = new Schema({
  monthTarget: {
    type: Number,
    default:50000
   // required: true
  },

  promoterId:{
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },

  bonus: {
    type: Number,
    default:500
   
  },
 month:{
    type: Number,
    required:true
 },
 
 year:{
    type: Number,
    required:true
 },

 addedBonus:{
    type: Number,
    default:0
    
 },
 targetCompleted:{
    type:Number,
    default:0

 },

 incentivesRecieved:{
    type:Number,
    default:0
 },



 targetAcheived:{
  type: String,
  default:"NO",
  enum:["YES","NO"]
 },

  bonusAddedDate: {
    type: String,
    trim:true // default to the current date when the bonus is added
  },
  // other fields you may need
  logCreatedDate:{
    type:String,
    trim:true
  },
  
  logModifiedDate:{
    type:String,
    trim:true
  },


});

// Define a schema for your main document that might include multiple targets and bonuses


// Create model for targets and bonuses
const TargetsAndBonuses = mongoose.model('TargetsAndBonuses', TargetsAndBonusesSchema);

// Create model for main document
//const MainDocument = mongoose.model('MainDocument', MainDocumentSchema);
module.exports = TargetsAndBonuses;
