import React from "react";
import ShowVideoList from "../ShowVideoList/ShowVideoList";

const WHLVideoList = ({ page, currentUser, videoList }) => {
  const theme = document.body.getAttribute("data-theme");
  const color = theme === "dark" ? "white" : "black";

  return (
    <>
      {currentUser ? (
        <>
          {videoList?.data
            ?.filter((q) => q?.viewer === currentUser)
            .reverse()
            .map((m) => {
              return (
                <>
                  <ShowVideoList videoId={m?.videoId} key={m?._id} />
                </>
              );
            })}
        </>
      ) : (
        <>
          <h2 style={{ color: color }}>Please login to Watch your {page} </h2>
        </>
      )}
    </>
  );
};

export default WHLVideoList;
