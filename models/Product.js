import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    originalPrice: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    artisan: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    wasteSource: { type: String, required: true },
    gradient: { type: String, required: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
