import React from "react";
import "./ShowVideoGrid.css";
import ShowVideo from "../ShowVideo/ShowVideo";

const ShowVideoGrid = ({ vids }) => {
  return (
    <div className="Container_ShowVideoGrid">
      {vids?.map((vid) => {
        return (
          <div key={vid._id} className="video_box_app">
            <ShowVideo vid={vid} />
          </div>
        );
      })}
    </div>
  );
};

export default ShowVideoGrid;
