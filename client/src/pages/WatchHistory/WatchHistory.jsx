import React from "react";
import WHL from "../../components/WHL/WHL";
import { useSelector } from "react-redux";

const WatchHistory = () => {

  const historyList = useSelector((state) => state.historyReducer);
  
  // const history = [
  //   {
  //     _id: 1,
  //     video_src: vid,
  //     Channel: "62fafe6752cea35a6c308685f",
  //     title: "video 1",
  //     Uploader: "abc",
  //     description: "description of video 1",
  //   },
  //   {
  //     _id: 2,
  //     video_src: vid,
  //     Channel: "62fafe6752cea35a6c308685f",
  //     title: "video 2",
  //     Uploader: "abc",
  //     description: "description of video 2",
  //   },
  //   {
  //     _id: 3,
  //     video_src: vid,
  //     Channel: "62fafe6752cea35a6c308685f",
  //     title: "video 3",
  //     Uploader: "abc",
  //     description: "description of video 3",
  //   },
  //   {
  //     _id: 4,
  //     video_src: vid,
  //     Channel: "62fafe6752cea35a6c308685f",
  //     title: "video 4",
  //     Uploader: "abc",
  //     description: "description of video 4",
  //   },
  // ];

  return <WHL page="History" videoList={historyList} />;
};

export default WatchHistory;
