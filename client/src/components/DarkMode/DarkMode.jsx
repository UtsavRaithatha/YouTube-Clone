import React, { useEffect, useState } from "react";

const DarkMode = () => {
  const [theme, setTheme] = useState("dark");

  const getLocation = () => {
    fetch("http://ip-api.com/json/")
      .then((response) => response.json())
      .then((data) => {
        const state = data.regionName;
        if (
          state === "Tamil Nadu" ||
          state === "Karnataka" ||
          state === "Andhra Pradesh" ||
          state === "Telangana"
        ) {
          const time = new Date().getHours();
          if (time >= 10 && time <= 24) {
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
