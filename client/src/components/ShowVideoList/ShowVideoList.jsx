import React from "react";
import ShowVideo from "../ShowVideo/ShowVideo";
import { useSelector } from "react-redux";

const ShowVideoList = ({ videoId }) => {
  const vids = useSelector((state) => state.videoReducer);

  return (
    <div className="Container_ShowVideoGrid">
      {vids?.data
        ?.filter((q) => q._id === videoId)
        .map((vid) => {
          return (
            <div key={vid._id} className="video_box_app">
              <ShowVideo vid={vid} />
            </div>
          );
        })}
    </div>
  );
};

export default ShowVideoList;
