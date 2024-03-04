// addressSchema.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    contactPerson: String,
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
