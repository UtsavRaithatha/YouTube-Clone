import React, { useState } from "react";
import "./VideoUpload.css";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../../actions/video";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const VideoUpload = ({ setVidUploadPage }) => {
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState("");

  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);

  const fileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percent = Math.floor((loaded * 100) / total);
      setProgress(percent);
      if (percent === 100) {
        setTimeout(() => {}, 3000);
        setVidUploadPage(false);
      }
    },
  };

  const uploadVideoFile = () => {
    if (!title) {
      alert("Please enter title of the video");
    } else if (!videoFile) {
      alert("Please select a video file");
    } else if (videoFile.size > 100000000) {
      alert("File size should be less than 100MB");
    } else {
      const fileData = new FormData();
      fileData.append("file", videoFile);
      fileData.append("title", title);
      fileData.append("channel", CurrentUser?.result._id);
      fileData.append("uploader", CurrentUser?.result.name);

      dispatch(uploadVideo({ fileData, fileOptions }));
    }
  };

  return (
    <div className="container_VidUpload">
      <input
        type="submit"
        name="text"
        value={"X"}
        className="ibtn_x"
        onClick={() => setVidUploadPage(false)}
      />
      <div className="container2_VidUpload">
        <div className="ibox_div_vidUpload">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="ibox_vidUpload"
            maxLength={30}
            placeholder="Enter title of your video"
          />
          <label htmlFor="file" className="ibox_vidUpload btn_vidUpload">
            <input
              type="file"
              name="file"
              className="ibox_vidUpload"
              style={{ fontSize: "1rem" }}
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </label>
        </div>
        <div className="ibox_div_vidUpload">
          <input
            onClick={() => uploadVideoFile()}
            type="submit"
            value="Upload"
            className="ibox_vidUpload btn_vidUpload"
          />
        </div>
        <div className="loader ibox_div_vidUpload">
          <CircularProgressbar
            value={progress}
            text={`${progress}`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: "butt",
              textSize: "20px",
              pathTransitionDuration: 0.5,
              pathColor: `rgba(255, 255, 255, ${progress / 100})`,
              textColor: "#f88",
              trailColor: "#adff2f",
              backgroundColor: "#3e98c7",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
