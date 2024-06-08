import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ShowVideoGrid from "../../components/ShowVideoGrid/ShowVideoGrid";
import "./YourVideo.css";
import { useSelector } from "react-redux";

const YourVideo = () => {
  const currentUser = useSelector((state) => state?.currentUserReducer);
  const vids = useSelector((state) => state.videoReducer)
    ?.data?.filter((q) => q?.videoChannel === currentUser?.result?._id)
    .reverse();

  return (
    <div className="container_Pages_App">
      <LeftSidebar />
      <div className="container2_Pages_App">
        <div className="container_yourvideo">
          <h1>Your Videos</h1>
          {currentUser ? (
            <>
              <ShowVideoGrid vids={vids} />
            </>
          ) : (
            <>
              <h3>Please login to Watch your Videos</h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourVideo;
