const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Employee Management Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP for password reset is:</p>
      <h1 style="letter-spacing:5px;">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  });
};

module.exports = { sendOTP };
