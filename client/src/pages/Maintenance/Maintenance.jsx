import React, { useState, useEffect } from "react";
import "./Maintenance.css";

const Maintenance = () => {
  // on reload redirect to "/"
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!redirected) {
      setTimeout(() => {
        setRedirected(true);
        window.location.href = "/";
      }, 50000);
    }
  }, [redirected]);

  return (
    <div className="maintenance-container">
      <h1>Site Maintenance in Progress</h1>
      <p className="maintenance-text">
        Our website is currently undergoing scheduled maintenance from 1PM to
        2PM IST. We apologize for any inconvenience caused.
      </p>
      <p className="maintenance-text">
        Please check back later. Thank you for your patience.
      </p>
    </div>
  );
};

export default Maintenance;
