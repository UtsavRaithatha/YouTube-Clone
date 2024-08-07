import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
import DarkMode from "./components/DarkMode/DarkMode";
import { getAllComments } from "./actions/comments";
import Maintenance from "./pages/Maintenance/Maintenance";
import { checkApi } from "./api";
import Stream from "./pages/Stream/Stream";
import CreateJoinRoom from "./pages/Stream/CreateJoinRoom";

function App() {
  const dispatch = useDispatch();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [OTPPage, setOTPPage] = useState(false);
  const [streamPage, setStreamPage] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await checkApi();

        if (res.status === 503) {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 503) {
          setIsMaintenance(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  useEffect(() => {
    if (!isLoading && !isMaintenance) {
      dispatch(fetchAllChannels());
      dispatch(getVideos());
      dispatch(getLikedVideos());
      dispatch(getWatchLater());
      dispatch(getHistory());
      dispatch(getAllComments());
    }
  }, [dispatch, isLoading, isMaintenance]);

  const [toggleDrawerSidebar, setToggleDrawerSidebar] = useState({
    display: "none",
  });

  const toggleStreamPage = (val) => {
    setStreamPage(val);
  };

  const [editcreatechannelbtn, setEditCreateChannelBtn] = useState(false);

  const toggleDrawer = () => {
    if (toggleDrawerSidebar.display === "none") {
      setToggleDrawerSidebar({ display: "flex" });
    } else {
      setToggleDrawerSidebar({ display: "none" });
    }
  };

  const toggleOTPPage = (val) => {
    setOTPPage(val);
  };

  const [vidUploadPage, setVidUploadPage] = useState(false);

  const isVideoCallFeatureAvailable = () => {
    const date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const hours = new Date(date).getHours();

    if (hours >= 18 && hours < 24) {
      return true;
    }

    return false;
  };

  return (
    <div className="App">
      <Router>
        <DarkMode />
        {isMaintenance ? (
          <Routes>
            <Route path="/maintenance" element={<Maintenance />} />
          </Routes>
        ) : (
          <>
            {streamPage ? (
              <Routes>
                <Route
                  path="/stream"
                  element={
                    isVideoCallFeatureAvailable() ? (
                      <CreateJoinRoom />
                    ) : (
                      <div className="video-call-not-available">
                        <h1>
                          Video Call Feature is available only from 6PM to 12AM
                          IST.
                        </h1>
                      </div>
                    )
                  }
                />
                <Route
                  path="/stream/:room"
                  element={
                    isVideoCallFeatureAvailable() ? (
                      <Stream />
                    ) : (
                      <div className="video-call-not-available">
                        <h1>
                          Video Call Feature is available only from 6PM to 12AM
                          IST.
                        </h1>
                      </div>
                    )
                  }
                />
              </Routes>
            ) : (
              <>
                <Navbar
                  setEditCreateChannelBtn={setEditCreateChannelBtn}
                  toggleDrawer={toggleDrawer}
                  toggleOTPPage={toggleOTPPage}
                  toggleStreamPage={toggleStreamPage}
                />
                {!OTPPage && (
                  <>
                    {vidUploadPage && (
                      <VideoUpload setVidUploadPage={setVidUploadPage} />
                    )}
                    {editcreatechannelbtn && (
                      <CreateEditChannel
                        setEditCreateChannelBtn={setEditCreateChannelBtn}
                      />
                    )}
                    <DrawerSidebar
                      toggleDrawer={toggleDrawer}
                      toggleDrawerSidebar={toggleDrawerSidebar}
                    />
                    <AllRoutes
                      setEditCreateChannelBtn={setEditCreateChannelBtn}
                      setVidUploadPage={setVidUploadPage}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
