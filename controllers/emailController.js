import { sendEmail } from "../utils/sendEmail.js";
import { orderDelivery } from "../emailTemplates/orderDelivery.js";
import { confirmOrder } from "../emailTemplates/orderConfirmed.js";

export const sendCustomerEmail = async (req, res) => {
  try {
    const { emailContent, customerEmail, emailSubject } = req.body;

    await sendEmail(customerEmail, emailContent, emailSubject);

    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending email",
    });
  }
};

export const sendDeliveryUpdateEmail = async (req, res) => {
  try {
    const {
      customerName,
      orderNumber,
      trackingLink,
      description,
      deliveryAddress,
      customerEmail,
    } = req.body;

    const emailRes = await sendEmail(
      customerEmail,
      orderDelivery(customerName, orderNumber, trackingLink, deliveryAddress,description),
      "Your order is on it's way"
    );

    return res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("Error", error);
    console.log("Error message :", error.message);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
