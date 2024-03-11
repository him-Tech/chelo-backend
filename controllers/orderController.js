import Customer from "../models/customerSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";

export const createOrder = async (req, res) => {
  try {
    const customerId = req.user._id;

    const {
      generatedId,
      productName,
      productQuantity,
      productSize,
      productColor,
      orderTotalAmount,
      status,
      product,
    } = req.body;

    // Create the order
    const order = new Order({
      generatedId,
      productName,
      productQuantity,
      productSize,
      productColor,
      orderTotalAmount,
      status,
      product: product, // Save the product IDs directly in the array
    });

    // Save the order to the database
    await order.save();

    // Update the customer's orderHistory
    await Customer.findByIdAndUpdate(
      customerId,
      {
        $push: { orderHistory: order._id },
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during creating order",
      error,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate("product");
    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Order data fetched sussceesully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during fetching order data",
      error,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ success: true, error: "Order not found" });
    }

    await Customer.updateOne(
      { orderHistory: orderId },
      { $pull: { orderHistory: orderId } }
    );

    res.status(200).json({ success: true, deletedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
