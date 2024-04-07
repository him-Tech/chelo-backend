import mongoose from "mongoose";
import Category from "./categorySchema.js";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },    
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    status: {
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
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    itemType: {
      // Cotton, nylon, etc
      type: String,
    },
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
