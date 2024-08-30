import nodemailer from "nodemailer";

export const sendEmail = async (email, emailContent, emailSubject) => {
  try {
    // Create transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send mail
    let info = await transporter.sendMail({
      from: `FRD`,
      to: email,
      subject: emailSubject,
      html: `${emailContent}`,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
