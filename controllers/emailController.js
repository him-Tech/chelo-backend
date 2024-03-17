import { sendEmail } from "../utils/sendEmail.js";

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
