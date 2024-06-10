const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
