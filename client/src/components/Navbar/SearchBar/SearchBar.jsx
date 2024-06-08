import { useState } from "react";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { BsMicFill } from "react-icons/bs";
import SearchList from "./SearchList";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchList, setSearchList] = useState(false);
  const TitleArray = useSelector((s) => s.videoReducer)
    ?.data?.filter((q) =>
      q?.videoTitle.toUpperCase().includes(searchQuery.toUpperCase())
    )
    .map((m) => m?.videoTitle);

  return (
    <div className="SearchBar_Container">
      <div className="SearchBar_Container2">
        <div className="search_div">
          <input
            type="text"
            placeholder="Search"
            className="iBox_SearchBar"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => setSearchList(true)}
            value={searchQuery}
          />
          <Link to={`/search/${searchQuery}`}>
            <FaSearch
              className="searchIcon_SearchBar"
              onClick={(e) => setSearchList(false)}
            />
          </Link>
          <BsMicFill className="micIcon_SearchBar" />
          {searchQuery && searchList && (
            <SearchList
              setSearchQuery={setSearchQuery}
              TitleArray={TitleArray}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
