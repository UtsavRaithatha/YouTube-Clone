import React from "react";
import "./Library.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import vid from "../../components/Video/vid.mp4";
import "./Library.css";
import { FaHistory } from "react-icons/fa";
import WHLVideoList from "../../components/WHL/WHLVideoList";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";

const Library = () => {
  const currentUser = useSelector((state) => state?.currentUserReducer);
  const watchLaterList = useSelector((state) => state.watchLaterReducer);
  const likedVideosList = useSelector((state) => state.likedVideoReducer);
  const historyList = useSelector((state) => state.historyReducer);

  return (
    <div className="container_Pages_App">
      <LeftSidebar />
      <div className="container2_Pages_App">
        <div className="container_libraryPage">
          <h1 className="title_container_libraryPage">
            <b>
              <FaHistory />
            </b>
            <b>History</b>
          </h1>
          <div className="container_videoList_libraryPage">
            <WHLVideoList page="History" currentUser={currentUser?.result._id} videoList={historyList} />
          </div>
        </div>

        <div className="container_libraryPage">
          <h1 className="title_container_libraryPage">
            <b>
              <MdOutlineWatchLater />
            </b>
            <b>Watch Later</b>
          </h1>
          <div className="container_videoList_libraryPage">
            <WHLVideoList page="WatchLater" currentUser={currentUser?.result._id} videoList={watchLaterList} />
          </div>
        </div>

        <div className="container_libraryPage">
          <h1 className="title_container_libraryPage">
            <b>
              <AiOutlineLike />
            </b>
            <b>Liked Videos</b>
          </h1>
          <div className="container_videoList_libraryPage">
            <WHLVideoList page="LikedVideo" currentUser={currentUser?.result._id} videoList={likedVideosList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
