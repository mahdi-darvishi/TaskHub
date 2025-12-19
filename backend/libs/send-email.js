import nodemailer from "nodemailer";

// Function to send emails using Nodemailer
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create a transporter using SMTP configuration from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // e.g., 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL, // Your email address
        pass: process.env.SMTP_PASSWORD, // Your App Password
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"TaskHub Support" <${process.env.SMTP_EMAIL}>`, // Sender address
      to, // Receiver address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Throw error so the controller knows email sending failed
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
