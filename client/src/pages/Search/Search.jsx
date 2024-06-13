import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ShowVideoGrid from "../../components/ShowVideoGrid/ShowVideoGrid";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Search = () => {
  const { searchQuery } = useParams();

  const theme = document.body.getAttribute("data-theme");
  const color = theme === "dark" ? "white" : "black";

  const vids = useSelector((state) => state.videoReducer)
    ?.data?.filter((q) =>
      q?.videoTitle.toUpperCase().includes(searchQuery.toUpperCase())
    )
    .reverse();

  return (
    <div className="container_Pages_App">
      <LeftSidebar />
      <div className="container2_Pages_App">
        <h2 style={{ color: color }}>Search Results for {searchQuery}...</h2>
        <ShowVideoGrid vids={vids} />
      </div>
    </div>
  );
};

export default Search;
