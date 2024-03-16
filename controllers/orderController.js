import Customer from "../models/customerSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import { response } from "express";
import { sendEmail } from "../utils/sendEmail.js";


export const createOrder = async (req, res) => {
  try {
    const customerId = req.user._id;
    console.log("customer ki id: ->>", customerId);

    const {
      generatedId,
      productName,
      productQuantity,
      productSize,
      productColor,
      orderTotalAmount,
      product,
    } = req.body;

    const defaultStatus = {
      statusType: "OrderPlaced",
      deliveryCompany: "Will be updated soon",
      trackingNumber: "Will be updated soon",
    };

    // Create the order
    const order = new Order({
      generatedId,
      productName,
      productQuantity,
      productSize,
      productColor,
      orderTotalAmount,
      status: defaultStatus,
      product: product,
      customer: customerId,
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
      message: "Order data fetched successfully",
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
      return res.status(404).json({ success: true, message: "Order not found" });
    }

    await Customer.updateOne(
      { orderHistory: orderId },
      { $pull: { orderHistory: orderId } }
    );

    res.status(200).json({ success: true, deletedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const {
      statusType,
      deliveryCompany,
      trackingNumber,
      emailContent,
      customerEmail,
    } = req.body;

    // Check for order in DB
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order doesn't exist",
      });
    }

    const updateFields = {};
    if (statusType) updateFields["status.statusType"] = statusType;
    if (deliveryCompany)
      updateFields["status.deliveryCompany"] = deliveryCompany;
    if (trackingNumber) updateFields["status.trackingNumber"] = trackingNumber;
    await Order.findByIdAndUpdate(orderId, updateFields);

    if (emailContent) {
      await sendEmail(customerEmail, emailContent);
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      updateFields,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};
