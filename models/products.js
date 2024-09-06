const mongoose = require('mongoose');


// const counterSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   sequence_value: { type: Number, default: 0 }
// });

// const Counter = mongoose.model('Counter', counterSchema);


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
   
  },
  incentive: {
     type: Number
  },
  serialNumber:
  {
    type: String
  },
  
  description: String,
  EANcode:{
    type:String,

  },
  SKUid:{
   type:String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  path: {
    type: String,
    //required: true,
    min: 0
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  squId: {
    type: String,
   // required: true
  },

  logCreatedDate: {
    type: String,
    trim: true,
  },
  logModifiedDate: {
    type: String,
    trim: true,
  },

  //productId: { type: Number, default: 0 },
});




// async function getNextSequenceValue(sequenceName) {
//   const counter = await Counter.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.sequence_value; 
// }


// productSchema.pre('save', async function (next) {
//   if (!this.productId) {
//     this.productId = await getNextSequenceValue('productId');
//   }
//   next();
// });


// productSchema.post('create', function(error, doc, next) {
//   if (error.name === 'MongoError' && error.code === 11000) {
//     // Duplicate key error, handle it here
//     console.warn("Duplicate key error, ignoring:", error.message);
//     // Continue with other operations or handle the error as needed
//   } else {
//     // For other types of errors, call the next middleware
//     next(error);
//   }
// });

// productSchema.pre('create', async function(next) {
//     try {
//       const existingProduct = await this.constructor.findOne({ name: this.name });
//       if (existingProduct) {
//         throw new Error('Duplicate product name. Please choose a different name.');
//       }
//       next();
//     } catch (err) {
//       console.log(err)
//       next(err);
//     }
//   });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
