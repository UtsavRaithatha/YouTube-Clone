import mongoose from "mongoose";

const otpEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

const otpPhoneSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

const OTPEmail = mongoose.model("OTPEmail", otpEmailSchema);
const OTPPhone = mongoose.model("OTPPhone", otpPhoneSchema);

export { OTPEmail, OTPPhone };
