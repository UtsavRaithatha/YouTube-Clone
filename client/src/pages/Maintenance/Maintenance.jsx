import React, { useEffect } from "react";
import "./Maintenance.css";

const Maintenance = () => {
  useEffect(() => {
    const checkAndRedirect = async () => {
      const now = new Date();
      const hour = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }).format(now);

      if (parseInt(hour) !== 11) {
        window.location.href = "/";
      }
    };

    const interval = setInterval(() => {
      checkAndRedirect();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

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
