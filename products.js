const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
   
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
  }
});


productSchema.pre('save', async function(next) {
    try {
      const existingProduct = await this.constructor.findOne({ name: this.name });
      if (existingProduct) {
        throw new Error('Duplicate product name. Please choose a different name.');
      }
      next();
    } catch (err) {
      console.log(err)
      next(err);
    }
  });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
