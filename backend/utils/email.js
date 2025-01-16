const axios = require("axios");
require("dotenv").config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;

exports.sendResetEmail = async (email, resetLink) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "20bcs1973@cuchd.in", name: "Expense Tracker" },
        to: [{ email }],
        subject: "Password Reset Request",
        htmlContent: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
