import React, { useEffect, useRef, useState } from "react";
import "./OTPScreen.css";

const OTPScreen = ({ sendOTP, verifyOTP, emailOrPhone }) => {
  const [OTP, setOTP] = useState(new Array(4).fill(""));
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOTP([...OTP.map((d, i) => (i === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.keyCode === 8 && !OTP[index]) {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleResetOTP = () => {
    setOTP(new Array(4).fill(""));
    sendOTP(emailOrPhone);
    alert("OTP has been resent");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP(OTP.join(""));
  };

  return (
    <div className="otp-screen">
      <form>
        <h2>Enter OTP</h2>
        <div className="otp-instruction">
          {OTP.map((num, index) => {
            return (
              <input
                key={index}
                type="text"
                name="OTP"
                maxLength="1"
                value={num}
                className="otp-field"
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                ref={index === 0 ? firstInputRef : null}
              />
            );
          })}
        </div>
        <p className="otp-expiry">The OTP will expire in next 2 minutes</p>
        <div className="otp-btns">
          <button type="button" className="otp-resend" onClick={handleResetOTP}>
            Resend OTP
          </button>
          <button type="submit" className="otp-submit" onClick={handleSubmit}>
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPScreen;
