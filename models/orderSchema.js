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
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
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
