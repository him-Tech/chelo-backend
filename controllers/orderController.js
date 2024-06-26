import Customer from "../models/customerSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import { response } from "express";
import { sendEmail } from "../utils/sendEmail.js";
import { confirmOrder } from "../emailTemplates/orderConfirmed.js";

const confirmOrderUpdateEmail = async (
  customerName,
  orderNumber,
  orderDate,
  productsData,
  customerEmail
) => {
  try {
    const emailRes = await sendEmail(
      customerEmail,
      confirmOrder(orderNumber, customerName, orderDate, productsData),
      "We have got your order"
    );

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.log("Error", error);
    console.log("Error message :", error.message);
    return {
      success: false,
      message: "Something went wrong...",
    };
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      generatedId,
      productQuantity,
      orderTotalAmount,
      productNames,
      products, // This should be an array of product ObjectId's
    } = req.body;

    const defaultStatus = {
      statusType: "OrderPlaced",
      deliveryCompany: "Will be updated soon",
      trackingNumber: "Will be updated soon",
    };

    const customerData = {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      address: req.body.address,
    };

    const productsForEmail = [];
    await Promise.all(
      products.map(async ({ productId, quantity, size }) => {
        // Ensure the product exists
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found.`);
        }

        // Push product details to productsForEmail array
        productsForEmail.push({
          productName: product.name,
          productQuantity: quantity, // Use the quantity from the request body
          productSize: size,
          productDetails: product.description,
          productPrice: product.price,
          productImage: product.img,
        });
      })
    );

    // Create the order
    const order = new Order({
      generatedId,
      productQuantity,
      orderTotalAmount,
      status: defaultStatus,
      productName: productNames,
      products: products.map(({ productId, quantity, size }) => ({
        product: productId,
        quantity,
        orderedProductSize: size,
      })),
      customer: customerData,
    });

    const emailData = {
      customerName: req.body.customerName,
      ordernumber: req.body.generatedId,
      orderDate: Date.now(),
      productsdata: productsForEmail,
      customerEmail: req.body.customerEmail,
    };
    await confirmOrderUpdateEmail(
      req.body.customerName,
      req.body.generatedId,
      Date.now(),
      productsForEmail,
      req.body.customerEmail
    );

    await order.save();

    console.log("order successful");

    for (const { productId, quantity } of products) {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      // Convert quantity to integer using parseInt
      const parsedQuantity = parseInt(quantity, 10); // Base 10

      if (isNaN(parsedQuantity)) {
        throw new Error(
          `Invalid quantity value for product with ID ${productId}.`
        );
      }
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -parsedQuantity },
      });

      console.log(
        `Product with ID ${productId} updated successfully. Quantity decreased by ${parsedQuantity}.`
      );
    }

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
    const order = await Order.findById(orderId).populate({
      path: "products",
      populate: {
        path: "product",
        select: "-createdAt -updatedAt -__v", // Exclude unnecessary fields
      },
    });
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const productsWithQuantity = order.products.map((orderProduct) => ({
      ...orderProduct.product.toObject(),
      quantity: orderProduct.quantity,
      orderedProductSize: orderProduct.orderedProductSize,
    }));

    // Return the order data with the updated products array
    res.status(200).json({
      message: "Order data fetched successfully",
      order: {
        ...order.toObject(),
        products: productsWithQuantity,
      },
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
      return res
        .status(404)
        .json({ success: true, message: "Order not found" });
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
      emailSubject,
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

    if (emailContent && customerEmail && emailSubject) {
      await sendEmail(customerEmail, emailContent, emailSubject);
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
