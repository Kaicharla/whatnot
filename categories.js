const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  brand_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },
  ],
  
  logCreatedDate: {
    type: String,
    trim: true
  },
  logModifiedDate: {
    type: String,
    trim: true
  }
  // Other category fields as needed
});

// Ensure indexes for efficient querying
categorySchema.index({ brand_id: 1 });
categorySchema.index({ name: 1 });

categorySchema.pre('save', async function (next) {
  try {
    const existingCategory = await this.constructor.findOne({ name: this.name });
    if (existingCategory && existingCategory._id.toString() !== this._id.toString()) {
      throw new Error('Duplicate category name. Please choose a different name.');
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
