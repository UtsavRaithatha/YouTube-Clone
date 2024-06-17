import React, { useEffect, useRef } from "react";
import "./PhoneScreen.css";

const PhoneScreen = ({ userPhone, setUserPhone, handlePhone }) => {
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setUserPhone([
      ...userPhone.map((d, i) => (i === index ? element.value : d)),
    ]);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.keyCode === 8 && !userPhone[index]) {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  return (
    <div className="phone-screen">
      <form onSubmit={handlePhone}>
        <h2>Enter Your Phone Number</h2>
        <div className="phone-instruction">
          {userPhone.map((num, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={num}
              className="phone-field"
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              ref={index === 0 ? firstInputRef : null}
            />
          ))}
        </div>
        <button type="submit" className="phone-submit">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default PhoneScreen;
