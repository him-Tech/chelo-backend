import Admin from "../models/adminSchema.js";
import Order from "../models/orderSchema.js";
import Customer from "../models/customerSchema.js";
import Review from "../models/customerReviewsSchema.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, dob, gender } = req.body;
    if (!name || !email || !password || !dob || !gender) {
      return res.status(404).send({
        success: false,
        message: "All the fields are Mendatory",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send({
        success: false,
        message: "Admin is Already Register please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      dob,
      gender,
    });

    // Save the Admin to the database
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      Admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during registering Admin",
      error,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vaildation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check Admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).send({
        success: false,
        message: "This email is not registered with us",
      });
    }

    const match = await comparePassword(password, admin.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password or email",
      });
    }

    //token
    const token = await jwt.sign({ _id: admin._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error (Login failed)",
      error,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user._id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No admin found with this ID",
      });
    }

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No admin registered with this email address",
      });
    }

    const match = await comparePassword(currentPassword, admin.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    const updatedPassword = await Admin.findByIdAndUpdate(
      adminId,
      { password: hashedPassword }, // Update only the 'password' field
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { currentEmail, newEmail, currentPassword } = req.body;
    const adminId = req.user._id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No admin found with this ID",
      });
    }

    const match = await comparePassword(currentPassword, admin.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (admin.email !== currentEmail) {
      return res.status(400).json({
        success: false,
        message: "Current email is incorrect",
      });
    }

    const updatedEmail = await Admin.findByIdAndUpdate(
      adminId,
      { email: newEmail },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Email changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error changing admin email",
    });
  }
};

export const adminData = async (req, res) => {
  try {
    const adminId = req.user._id;
    const admin = await Admin.findById(adminId);
    if (!admin)
      return res.status(404).json({
        success: false,
        message: "Error fetching admin details",
      });
    return res.status(200).json({
      admin,
      success: true,
      message: "Admin data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Interval server error",
    });
  }
};

export const getCustomerData = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
      message: "Customer data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer data",
      error: error.message,
    });
  }
};

export const getAllCustomersOnPlatform = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({
      success: true,
      message: "All customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching all customers on platform",
      error,
    });
  }
};

export const getAllOrdersOnPlatform = async (req, res) => {
  try {
    const order = await Order.find();
    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching all orders",
      error,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating order data",
      error,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const existingCustomer = await Customer.findById(customerId);
    if (!existingCustomer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    const deletedUser = await Customer.findByIdAndDelete(customerId);
    res.status(200).json({
      success: true,
      message: "Customer deleted successful",
      deletedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting customer" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching all reviews on platform",
      error,
    });
  }
};

export const deleteReviewsAsAdmin = async (req, res) => {
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
