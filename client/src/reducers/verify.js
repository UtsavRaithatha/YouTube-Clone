const verifyReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "SEND_OTP":
      return { ...state };
    case "VERIFY_OTP":
      return { ...state, data: action.payload };
    case "SEND_OTP_SMS":
      return { ...state };
    case "VERIFY_OTP_SMS":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default verifyReducer;
