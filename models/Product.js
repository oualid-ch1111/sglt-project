import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }

  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
