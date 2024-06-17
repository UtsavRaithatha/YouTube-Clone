import express from "express";
import {
  sendOTP,
  verifyOTP,
  sendOTPSMS,
  verifyOTPSMS,
} from "../controllers/verify.js";

const router = express.Router();

router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/sendOTP-sms", sendOTPSMS);
router.post("/verifyOTP-sms", verifyOTPSMS);

export default router;
