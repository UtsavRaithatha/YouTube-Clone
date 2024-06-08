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

const Navbar = ({ toggleDrawer, setEditCreateChannelBtn }) => {
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  // console.log(CurrentUser);

  const [authBtn, setAuthBtn] = useState(false);

  // const CurrentUser = {
  //   result: {
  //     name: "abc",
  //     email: "abc@gmail.com",
  //     joinedOn: "2021-09-17T08:33:50.000Z",
  //   },
  // };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const dispatch = useDispatch();

  const onSuccess = (response) => {
    const email = response?.profileObj.email;
    console.log(email);
    dispatch(login({ email }));
  };

  const onFailure = (response) => {
    console.log("Failed to login", response);
  };

  return (
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
            <div className="Channel_logo_App" onClick={() => setAuthBtn(true)}>
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
  );
};

export default Navbar;
