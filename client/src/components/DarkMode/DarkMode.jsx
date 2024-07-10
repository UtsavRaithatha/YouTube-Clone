import React, { useEffect, useState } from "react";

const DarkMode = () => {
  const [theme, setTheme] = useState("dark");

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
          const time = new Date().getHours();
          if (time >= 10 && time <= 12) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        } else {
          setTheme("dark");
        }
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getLocation();
    document.querySelector("body").setAttribute("data-theme", theme);
  }, [theme]);

  return <></>;
};

export default DarkMode;
