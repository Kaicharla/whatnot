// Brand.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
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
  // You can add more fields as needed
});


// brandSchema.pre('save', async function(next) {
//   try {
//     const existingProduct = await this.constructor.findOne({ name: this.name });
//     if (existingProduct && (!this.isNew || !this.isModified('name'))) {
//       throw new Error('Duplicate brand name. Please choose a different name.');
//     }
//     next();
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });


// brandSchema.pre('create', async function(next) {
//   try {
//     const existingProduct = await this.constructor.findOne({ name: this.name });
//     if (existingProduct) {
//       throw new Error('Duplicate brand name. Please choose a different name.') ;
//     }
//     next();
//   } catch (err) {
//     console.log(err)
//     next(err);
//   }
// });


const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
