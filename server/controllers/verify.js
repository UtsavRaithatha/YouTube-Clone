import nodemailer from "nodemailer";
import { Vonage } from "@vonage/server-sdk";
import otpGenerator from "otp-generator";
import { OTPEmail, OTPPhone } from "../models/otp.js";
import twilio from "twilio";
import messagebird from "messagebird";

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  try {
    await OTPEmail.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    );

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: {
        name: "YouTube Clone",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "OTP for login",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center;">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube Clone" style="width: 100px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #333; text-align: center;">Your One-Time Password</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">
              To complete your login, please use the following OTP:
            </p>
            <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #007BFF;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">
              This OTP is valid for 10 minutes. Please do not share it with anyone.
            </p>
            <p style="font-size: 14px; color: #777; text-align: center;">
              If you did not request this OTP, please ignore this email.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://you-tube-clone-iota-coral.vercel.app/" style="font-size: 14px; color: #007BFF; text-decoration: none;">Visit our website</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">
              © 2024 YouTube Clone. All rights reserved.
            </p>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending OTP");
      }
      res.status(200).send("OTP sent");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const data = await OTPEmail.findOne({ email });

    if (data.otp === otp) {
      await OTPEmail.deleteOne({ email });
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const sendOTPSMS = async (req, res) => {
  const { phone } = req.body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new twilio(accountSid, authToken);

  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  try {
    await OTPPhone.findOneAndUpdate(
      { phone },
      { phone, otp },
      { upsert: true, new: true }
    );

    client.messages
      .create({
        body: `Your OTP for YouTube Clone is ${otp}. Please do not share it with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      })
      .then((message) => {})
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
};

export const verifyOTPSMS = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const data = await OTPPhone.findOne({ phone });

    if (data.otp === otp) {
      await OTPPhone.deleteOne({ phone });
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
