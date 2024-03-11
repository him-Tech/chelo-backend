import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      data: Buffer,
      contentType: String,
    },
    status: {
      // whether the product is available or out of stock
      type: Boolean,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      // Stationary items, clothes, gifts, etc....
      type: String,
      required: true,
    },
    itemType: {
      // Cotton, nylon, etc
      type: String,
    },
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
    colors: [
      {
        type: String,
        required: true,
      },
    ],
    quantity: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
