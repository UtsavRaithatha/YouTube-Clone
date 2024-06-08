import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./components/AllRoutes";
import DrawerSidebar from "./components/LeftSidebar/DrawerSidebar";
import CreateEditChannel from "./pages/Channel/CreateEditChannel";
import { fetchAllChannels } from "./actions/channelUser";
import { useDispatch } from "react-redux";
import VideoUpload from "./pages/VideoUpload/VideoUpload";
import { getVideos } from "./actions/video";
import { getLikedVideos } from "./actions/likedVideo";
import { getWatchLater } from "./actions/watchLater";
import { getHistory } from "./actions/history";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllChannels());
    dispatch(getVideos());
    dispatch(getLikedVideos());
    dispatch(getWatchLater());
    dispatch(getHistory());
  }, [dispatch]);

  const [toggleDrawerSidebar, setToggleDrawerSidebar] = useState({
    display: "none",
  });

  const [editcreatechannelbtn, setEditCreateChannelBtn] = useState(false);

  const toggleDrawer = () => {
    if (toggleDrawerSidebar.display === "none") {
      setToggleDrawerSidebar({ display: "flex" });
    } else {
      setToggleDrawerSidebar({ display: "none" });
    }
  };

  const [vidUploadPage, setVidUploadPage] = useState(false);

  return (
    <div className="App">
      <Router>
        {vidUploadPage && <VideoUpload setVidUploadPage={setVidUploadPage} />}
        {editcreatechannelbtn && (
          <CreateEditChannel
            setEditCreateChannelBtn={setEditCreateChannelBtn}
          />
        )}
        <Navbar
          setEditCreateChannelBtn={setEditCreateChannelBtn}
          toggleDrawer={toggleDrawer}
        />
        <DrawerSidebar
          toggleDrawer={toggleDrawer}
          toggleDrawerSidebar={toggleDrawerSidebar}
        />
        <AllRoutes
          setEditCreateChannelBtn={setEditCreateChannelBtn}
          setVidUploadPage={setVidUploadPage}
        />
      </Router>
    </div>
  );
}

export default App;
