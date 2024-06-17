import * as api from "../api";

export const sendOTP = (email) => async (dispatch) => {
  try {
    const { data } = await api.sendOTP(email);
    dispatch({ type: "SEND_OTP", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTP = (verifyData) => async (dispatch) => {
  try {
    const { email, otp } = verifyData;
    const { data } = await api.verifyOTP(email, otp);
    dispatch({ type: "VERIFY_OTP", payload: data });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendOTPSMS = (phone) => async (dispatch) => {
  try {
    const { data } = await api.sendOTPSMS(phone);
    dispatch({ type: "SEND_OTP_SMS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTPSMS = (verifyData) => async (dispatch) => {
  try {
    const { phone, otp } = verifyData;
    const { data } = await api.verifyOTPSMS(phone, otp);
    dispatch({ type: "VERIFY_OTP_SMS", payload: data });
    return data;
  } catch (error) {
    console.log(error);
  }
};
