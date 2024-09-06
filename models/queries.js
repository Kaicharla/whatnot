const mongoose = require('mongoose');

// Define the schema for user queries
const querySchema = new mongoose.Schema({
    promoterId:{
        type: mongoose.Schema.Types.ObjectId, // Assuming you have users stored in another collection
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming you have users stored in another collection
       // required: true
    },
    subject: {
        type: String,
        //required: true
    },
    message: {
        type: String,
        required: true
    },
    ccMail:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'], // Enum for query status
        default: 'Open'
    },
    logCreatedDate:{
        type: String,
        required: true
    },
    logModifiedDate:{
        type: String,
       // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model for user queries
const Query = mongoose.model('Query', querySchema);

module.exports = Query;
