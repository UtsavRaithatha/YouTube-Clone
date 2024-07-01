import React, { useEffect } from "react";
import "./ShowVideoGrid.css";
import ShowVideo from "../ShowVideo/ShowVideo";
import { useDispatch, useSelector } from "react-redux";
import { setVids } from "../../actions/vids";

const ShowVideoGrid = ({ vids }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (vids && vids.length > 0) {
      const vidsArray = vids.map((vid) => vid._id);
      dispatch(setVids(vidsArray));
    }
  }, [vids, dispatch]);

  return (
    <div className="Container_ShowVideoGrid">
      {vids?.map((vid, index) => {
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
