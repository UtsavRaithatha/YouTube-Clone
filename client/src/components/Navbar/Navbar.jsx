import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import Auth from "../../pages/Auth/Auth";
import OTPScreen from "../OTPScreen/OTPScreen";
import {
  sendOTP as sendOTPAction,
  verifyOTP as VerifyOTPAction,
  sendOTPSMS as sendOTPSMSAction,
  verifyOTPSMS as verifyOTPSMSAction,
} from "../../actions/verify";
import axios from "axios";
import PhoneScreen from "../PhoneScreen/PhoneScreen";

const Navbar = ({ toggleDrawer, setEditCreateChannelBtn, toggleOTPPage }) => {
  const CurrentUser = useSelector((state) => state.currentUserReducer);

  const [authBtn, setAuthBtn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState(new Array(10).fill(""));
  const [otpType, setOtpType] = useState("phone");
  const [showOTPPage, setShowOTPPage] = useState(false);
  const [showPhonePage, setShowPhonePage] = useState(false);

  const getLocation = () => {
    fetch(`https://ipinfo.io/json?token=${process.env.REACT_APP_IPINFO_TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        const state = data.region;
        if (
          state === "Tamil Nadu" ||
          state === "Kerala" ||
          state === "Karnataka" ||
          state === "Andhra Pradesh" ||
          state === "Telangana"
        ) {
          setOtpType("email");
        } else {
          setOtpType("phone");
        }
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
    getLocation();
  }, []);

  const dispatch = useDispatch();

  const sendOTP = async (emailOrPhone) => {
    try {
      if (otpType === "email") {
        dispatch(sendOTPAction(emailOrPhone));
      } else {
        dispatch(sendOTPSMSAction(emailOrPhone));
      }
    } catch (error) {
      console.log("Error while sending OTP", error);
    }
  };

  const onSuccess = async (response) => {
    const email = response?.profileObj.email;
    setUserEmail(email);

    if (otpType === "email") {
      await sendOTP(email);
      setShowOTPPage(true);
      toggleOTPPage(true);
    } else {
      setShowPhonePage(true);
      setShowOTPPage(false);
      toggleOTPPage(true);
    }
  };

  const onFailure = (response) => {
    console.log("Failed to login", response);
  };

  const verifyOTP = async (OTP) => {
    if (otpType === "email") {
      try {
        const res = await dispatch(
          VerifyOTPAction({ email: userEmail, otp: OTP })
        );
        if (res.success) {
          dispatch(login({ email: userEmail }));
          setShowOTPPage(false);
          toggleOTPPage(false);
          setAuthBtn(false);
        }
      } catch (error) {
        alert("Invalid OTP");
      }
    } else {
      try {
        const res = await dispatch(
          verifyOTPSMSAction({ phone: "+91" + userPhone.join(""), otp: OTP })
        );

        if (res.success) {
          dispatch(login({ email: userEmail }));
          setShowOTPPage(false);
          toggleOTPPage(false);
          setAuthBtn(false);
        } else {
          alert("Invalid OTP");
        }
      } catch (error) {
        alert("Invalid OTP");
      }
    }
  };

  const handlePhone = (e) => {
    e.preventDefault();

    for (let i = 0; i < userPhone.length; i++) {
      if (userPhone[i] === "" || isNaN(userPhone[i])) {
        alert("Please enter a valid phone number");
        return;
      }
    }

    sendOTP("+91" + userPhone.join(""));
    setShowPhonePage(false);
    setShowOTPPage(true);
    toggleOTPPage(true);
  };

  return (
    <>
      {!showOTPPage && !showPhonePage ? (
        <>
          <div className="Container_Navbar">
            <div className="Burger_Logo_Navbar">
              <div className="burger" onClick={() => toggleDrawer()}>
                <p></p>
                <p></p>
                <p></p>
              </div>
              <Link to={"/"} className="logo_div_navbar">
                <img src={logo} alt="YouTube logo" />
                <p className="logo_title_Navbar">YouTube</p>
              </Link>
            </div>
            <SearchBar />
            <RiVideoAddLine size={22} className="vid_bell_Navbar" />
            <div className="apps_Box">
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
              <p className="appBox"></p>
            </div>
            <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />
            <div className="Auth_cont_Navbar">
              {CurrentUser ? (
                <div
                  className="Channel_logo_App"
                  onClick={() => setAuthBtn(true)}
                >
                  <p className="firstChar_logo_App">
                    {CurrentUser?.result.name ? (
                      <>{CurrentUser?.result.name.charAt(0).toUpperCase()} </>
                    ) : (
                      <>{CurrentUser?.result.email.charAt(0).toUpperCase()}</>
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    render={(renderProps) => (
                      <p className="Auth_Btn" onClick={renderProps.onClick}>
                        <BiUserCircle size={22} />
                        <b>Sign In</b>
                      </p>
                    )}
                  />
                </>
              )}
            </div>
          </div>
          {authBtn && (
            <Auth
              setEditCreateChannelBtn={setEditCreateChannelBtn}
              setAuthBtn={setAuthBtn}
              User={CurrentUser}
            />
          )}
        </>
      ) : showPhonePage ? (
        <>
          <PhoneScreen
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            handlePhone={handlePhone}
          />
        </>
      ) : (
        <OTPScreen
          emailOrPhone={
            otpType === "email" ? userEmail : "+91" + userPhone.join("")
          }
          sendOTP={sendOTP}
          verifyOTP={verifyOTP}
        />
      )}
    </>
  );
};

export default Navbar;
