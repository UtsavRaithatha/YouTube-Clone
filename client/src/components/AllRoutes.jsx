import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Library from "../pages/Library/Library";
import YourVideo from "../pages/YourVideo/YourVideo";
import LikedVideo from "../pages/LikedVideo/LikedVideo";
import WatchHistory from "../pages/WatchHistory/WatchHistory";
import WatchLater from "../pages/WatchLater/WatchLater";
import VideoPage from "./VideoPage/VideoPage";
import Channel from "../pages/Channel/Channel";
import Search from "../pages/Search/Search";

const AllRoutes = ({ setEditCreateChannelBtn, setVidUploadPage }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/history" element={<WatchHistory />} />
      <Route path="/watchlater" element={<WatchLater />} />
      <Route path="/likedvideo" element={<LikedVideo />} />
      <Route path="/yourvideos" element={<YourVideo />} />
      <Route path="/videopage/:vid" element={<VideoPage />} />
      <Route path="/search/:searchQuery" element={<Search />} />
      <Route
        path="/channel/:cid"
        element={
          <Channel
            setEditCreateChannelBtn={setEditCreateChannelBtn}
            setVidUploadPage={setVidUploadPage}
          />
        }
      />
    </Routes>
  );
};

export default AllRoutes;
