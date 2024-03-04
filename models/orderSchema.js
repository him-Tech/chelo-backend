import mongoose from "mongoose";
import Product from "./productSchema.js";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    generatedId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: String,
      required: true,
    },
    productSize: {
      type: String,
      required: true,
    },
    productColor: {
      type: String,
      required: true,
    },
    orderTotalAmount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "refunded", "cancelled"],
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
