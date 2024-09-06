// Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
    
  },
description:{
  type: String
},
 
  logCreatedDate: {
    type: String,
    trim: true,
  },
  logModifiedDate: {
    type: String,
    trim: true,}
  // Other category fields as needed
});

// categorySchema.pre('save', async function(next) {
//   try {
//     const existingProduct = await this.constructor.findOne({ name: this.name });
//     if (existingProduct) {
//       throw new Error('Duplicate category name. Please choose a different name.');
//     }
//     next();
//   } catch (err) {
//     console.log(err)
//     next(err);
//   }
// });


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
