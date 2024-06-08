import React from "react";
import WHL from "../../components/WHL/WHL";
import { useSelector } from "react-redux";

const WatchLater = () => {
  const watchLaterList = useSelector((state) => state.watchLaterReducer);
  console.log(watchLaterList);
  return <WHL page="WatchLater" videoList={watchLaterList} />;
};

export default WatchLater;
