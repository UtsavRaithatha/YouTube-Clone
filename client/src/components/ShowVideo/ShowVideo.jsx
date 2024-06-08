import React from "react";
import "./ShowVideo.css";
import { Link } from "react-router-dom";
import moment from "moment";

const ShowVideo = ({ vid }) => {
  console.log(vid);

  return (
    <>
      <Link to={`/videopage/${vid?._id}`}>
        <video
          src={process.env.REACT_APP_BACKEND_URL + vid?.filePath}
          className="video_ShowVideo"
        ></video>
      </Link>
      <div className="video_description">
        <div className="Channel_logo_App">
          <div className="firstChar_logo_App">
            <>{vid?.uploader?.charAt(0).toUpperCase()}</>
          </div>
        </div>
        <div className="video_details">
          <p className="title_vid_ShowVideo">{vid?.videoTitle}</p>
          <pre className="vid_views_UploadTime">{vid?.uploader}</pre>
          <pre className="vid_views_UploadTime">
            {vid?.views} views <div className="dot"></div>
            {moment(vid?.createdAt).fromNow()}
          </pre>
        </div>
      </div>
    </>
  );
};

export default ShowVideo;
