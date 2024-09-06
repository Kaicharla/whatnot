const mongoose = require('mongoose');

// Define the schema for incentives data
const incentivesSchema = new mongoose.Schema({
  
  promoterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  promoterName: {
    type: String,
    required: true
  },
  pendingIncentives: {
    type: Number,
    default: 0,
    min:0
  },
  earnedIncentives: {
    type: Number,
    default: 0,
    min:0
  },
  achievedTargets: {
    type: Number,
    default: 0,
    min:0
  },
  pendingTargets: {
    type: Number,
    default: 0,
    min:0
  },
  totalTargets: {
    type: Number,
    default: 25,
    min:0
  },
  monthTarget: {
    type:Number,
    default:0
    
  },
  active: {
    type: Boolean,
    default: true
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

// Create a model based on the schema
const Incentive = mongoose.model('Incentive', incentivesSchema);

module.exports = Incentive;
