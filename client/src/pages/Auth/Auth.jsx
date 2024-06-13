  import React from "react";
import "./Auth.css";
import { GoogleLogout } from "react-google-login";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../actions/currentUser";
import { Link } from "react-router-dom";

const Auth = ({ User, setAuthBtn, setEditCreateChannelBtn }) => {
  const dispatch = useDispatch();

  const onLogoutSuccess = () => {
    dispatch(setCurrentUser(null));
    alert("You have been logged out successfully");
  };

  return (
    <div className="Auth_container" onClick={() => setAuthBtn(false)}>
      <div className="Auth_container2">
        <p className="user_details">
          <div className="Channel_logo_App">
            <p className="firstChar_logo_App">
              {User?.result.name
                ? User?.result.name.charAt(0).toUpperCase()
                : User?.result.email.charAt(0).toUpperCase()}
            </p>
          </div>
          <div className="email_auth">{User?.result.email}</div>
        </p>
        <div className="btns_auth">
          {User?.result.name ? (
            <>
              <Link to={`/channel/${User?.result._id}`} className="btn_auth">
                Your Channel
              </Link>
            </>
          ) : (
            <>
              <input
                type="submit"
                className="btn_auth"
                value="Create your channel"
                onClick={() => setEditCreateChannelBtn(true)}
              />
            </>
          )}

          <div>
            <GoogleLogout
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              onLogoutSuccess={onLogoutSuccess}
              render={(renderProps) => (
                <div onClick={renderProps.onClick} className="btn_auth">
                  <BiLogOut /> Log Out
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
