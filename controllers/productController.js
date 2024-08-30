import Customer from "../models/customerSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import Category from "../models/categorySchema.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import Review from "../models/customerReviewsSchema.js";

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

export const addProduct = async (req, res) => {
  try {
    let {
      name,
      status,
      price,
      description,
      category,
      itemType,
      sizes,
      colors,
      quantity,
    } = req.body;

    const thumbnail = req.files.thumbnailImage;

    //Image validation
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = thumbnail.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    if (!name || !status || !price || !description || !quantity || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    sizes = sizes.split(",");
    colors = colors.split(",");

    const addNewProduct = new Product({
      name,
      img: thumbnailImage.secure_url,
      status,
      price,
      description,
      category: category,
      itemType,
      sizes,
      colors,
      quantity,
    });

    await addNewProduct.save();

    res.status(200).json({
      success: true,
      message: "Product added successfully",
      addNewProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding new product",
      error,
    });
  }
};

export const getAllProductDetails = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("customerReviews");
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all product details" });
  }
};

export const getSingleProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId).populate("category");
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to find single product" });
  }
};

export const updateProductData = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if there's a new image file in the request
    let updatedThumbnail = product.img;
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const supportedTypes = ["jpg", "jpeg", "png"];
      const fileType = thumbnail.name.split(".")[1].toLowerCase();

      if (!isFileTypeSupported(fileType, supportedTypes)) {
        return res.status(400).json({
          success: false,
          message: "File format not supported",
        });
      }

      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      updatedThumbnail = thumbnailImage.secure_url;
      product.img = updatedThumbnail;
      await product.save();
    }

    if (req.body.sizes) {
      req.body.sizes = req.body.sizes.split(",");
    }
    if (req.body.colors) {
      req.body.colors = req.body.colors.split(", ");
    }

    // Update product data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body }, // Use $set to update only provided fields
      { new: true, runValidators: true }
    ).populate("category");

    // await product.save();

    res.status(200).json({ success: true, updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    await Order.updateMany(
      { product: productId },
      { $pull: { product: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { user, description, rating, productId } = req.body;

    if (!user || !description || !rating || !productId) {
      return res.status(204).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newReview = new Review({
      user,
      description,
      rating,
    });

    await newReview.save();
    await Product.findByIdAndUpdate(productId, {
      $push: { customerReviews: newReview._id },
    });

    res.status(200).json({
      success: true,
      message: "Product review updated successfully",
      newReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully...",
      deletedReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error,
    });
  }
};
