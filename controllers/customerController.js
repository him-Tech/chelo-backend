import Customer from "../models/customerSchema.js";
import Address from "../models/addressSchema.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, dob, gender } = req.body;
    if (!name || !email || !password || !dob || !gender) {
      return res.status(404).send({
        success: false,
        message: "All the fields are Mendatory",
      });
    }

    const exixtingCustomer = await Customer.findOne({ email });
    if (exixtingCustomer) {
      return res.status(400).send({
        success: false,
        message: "Customer is Already Register please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      dob,
      gender,
    });

    // Save the Customer to the database
    await newCustomer.save();

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      Customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during registering customer",
      error,
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vaildation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check Customer
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).send({
        success: false,
        message: "This email is not registered with us",
      });
    }

    const match = await comparePassword(password, customer.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password or email",
      });
    }

    //token
    const token = await jwt.sign(
      { _id: customer._id },
      process.env.JWT_SECERT,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
      customer,
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

export const orderHistory = async (req, res) => {
  try {
    const customerId = req.user;

    // Find the customer with the given ID and populate the orderHistory array with actual order documents
    const customer = await Customer.findById(customerId).populate(
      "orderHistory"
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Return the order history of the customer
    res.status(200).json({
      success: true,
      orderHistory: customer.orderHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addAddressToCustomer = async (req, res) => {
  try {
    const customerId = req.user._id;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required.",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Create a new Address document
    const newAddress = new Address(address);
    await newAddress.save();

    await Customer.findByIdAndUpdate(
      customerId,
      {
        $push: { addresses: newAddress._id },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Address added to customer successfully",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding address to customer",
      error,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    console.log("Address id during updation ->>", addressId);

    const existingAddress = await Address.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      req.body.address, // Update only the 'address' field
      { new: true, runValidators: true }
    );

    // Return the updated address in the response
    res.status(200).json({
      success: true,
      updatedAddress: req.body.address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    await Customer.updateOne(
      { addresses: addressId },
      { $pull: { addresses: addressId } }
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      deletedAddress,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting address" });
  }
};

export const allAddresses = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }
    const addresses = await Address.find({ _id: { $in: customer.addresses } });

    res.status(200).json({
      success: true,
      message: "All addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching all addresses",
      error,
    });
  }
};