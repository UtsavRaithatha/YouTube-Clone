import React, { useEffect } from "react";
import "./VideoPage.css";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import Comments from "../Comments/Comments";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { addToHistory } from "../../actions/history";
import { viewsVideo } from "../../actions/video";
// import VideoPlayer from "../VideoJS/VideoPlayer";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { addWatchedVideos } from "../../actions/channelUser";

const VideoPage = () => {
  const { vid } = useParams();

  const dispatch = useDispatch();

  const vids = useSelector((state) => state.videoReducer)?.data;

  const vv = vids?.filter((v) => v._id === vid)[0];

  const currentUser = useSelector((state) => state.currentUserReducer);

  const handleHistory = () => {
    dispatch(
      addToHistory({
        videoId: vid,
        viewer: currentUser?.result?._id,
      })
    );
  };

  const handleViews = () => {
    dispatch(viewsVideo({ videoId: vid }));
  };

  const handleWatchedVideos = () => {
    dispatch(addWatchedVideos(currentUser?.result?._id, vid));
  };

  useEffect(() => {
    if (currentUser) {
      handleHistory();
      handleWatchedVideos();
    }
    handleViews();
  }, []);

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          {/* <video
            src={process.env.REACT_APP_BACKEND_URL + vv?.filePath}
            className="video_ShowVideo_videoPage"
            controls
            autoPlay
          ></video> */}
          <VideoPlayer url={process.env.REACT_APP_BACKEND_URL + vv?.filePath} />
          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.videoTitle}</p>
              <div className="views_data_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.views} views <div className="dot"></div>
                  {moment(vv?.createdAt).fromNow()}
                </div>
                <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
              </div>
            </div>
            <Link
              to={`${vv?.videoChannel}`}
              className="channel_details_videoPage"
            >
              <b className="channel_logo_videoPage">
                <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
              </b>
              <p className="channel_name_videoPage">{vv?.uploader}</p>
            </Link>
            <div className="comments_VideoPage">
              <h2>
                <u>Comments</u>
              </h2>
              <Comments videoId={vv?._id} />
            </div>
          </div>
        </div>
        <div className="modeVideoBar">More Videos</div>
      </div>
    </div>
  );
};

export default VideoPage;
