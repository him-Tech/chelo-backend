import mongoose from "mongoose";
import Product from "./productSchema.js";
const { Schema } = mongoose;

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categoriesSchema);

export default Category;
