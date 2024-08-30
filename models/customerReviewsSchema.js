import mongoose from "mongoose";
import Customer from "./customerSchema.js";
const { Schema } = mongoose;

const customersReviews = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: Customer,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  {
    timeStamps: true,
  }
);

const Review = mongoose.model("Review", customersReviews);

export default Review;
