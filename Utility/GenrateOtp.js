// utils/sendOtp.js
import nodemailer from "nodemailer";


export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
};


// Mock send function (replace with actual SMS/email logic)
export const sendEmail = async (to, otp,EMAIL_USER,EMAIL_PASS) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

    const subject = "Your OTP Code";
    const text = `Your OTP code is: ${otp}. It is valid for 10 minutes.`;

  const mailOptions = {
    from: `"AirWire" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};
