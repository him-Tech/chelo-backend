import Customer from "../models/customerSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";


export const addProduct = async (req, res) => {
  try {
    const {
      name,
      img,
      status,
      price,
      description,
      category,
      itemType,
      sizes,
      colors,
      quantity,
    } = req.body;

    const addNewProduct = new Product({
      name,
      img,
      status,
      price,
      description,
      category,
      itemType,
      sizes,
      colors,
      quantity,
    });
    await addNewProduct.save();

    res.status(201).json({
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
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error fetching all product details" });
  }
};

export const getSingleProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    res.status(200).json({success: true, product });
  } catch (error) {
    res.status(500).json({success: false, error: "Unable to find single product" });
  }
};

export const updateProductData = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = Product.findById(productId);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({success: false, error: "Product not found" });
    }
    res.status(200).json({success: true, updatedProduct});
  } catch (error) {
    res.status(500).json({success: false, error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({success: false, error: "Error deleting product" });
  }
};
