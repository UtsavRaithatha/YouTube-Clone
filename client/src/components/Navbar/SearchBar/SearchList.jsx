import React from "react";
import "./SearchList.css";
import { FaSearch } from "react-icons/fa";

const SearchList = ({ TitleArray, setSearchQuery }) => {
  return (
    <div className="Container_SearchList">
      {TitleArray.map((item, index) => (
        <p
          key={index}
          className="titleItem"
          onClick={() => setSearchQuery(item)}
        >
          <FaSearch />
          {item}
        </p>
      ))}
    </div>
  );
};

export default SearchList;
