import mongoose from "mongoose";
import Product from "./productSchema.js";
import Customer from "./customerSchema.js";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    generatedId: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    orderTotalAmount: {
      type: Number,
      required: true,
    },
    status: {
      statusType: {
        type: String,
      },
      deliveryCompany: {
        type: String,
      },
      trackingNumber: {
        type: String,
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    productName: [
      {
        type: String,
        required: true,
      },
    ],
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        orderedProductSize: {
          type: String,
          required: true,
        },
      },
    ],

    customer: {
      customerName: {
        type: String,
        required: true,
      },
      customerEmail: {
        type: String,
        require: true,
      },
      address: {
        addressLine1: {
          type: String,
          required: true,
        },
        addressLine2: String,
        addressLine3: String,
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        streetCode: {
          type: String,
          required: true,
        },
        contactNumber: {
          type: String,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
