import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "./VideoPlayer.css";
import {
  MdArrowBack,
  MdArrowRight,
  MdForward10,
  MdFullscreen,
  MdPause,
  MdPictureInPicture,
  MdPlayArrow,
  MdReplay10,
  MdSettings,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../actions/notification";

const VideoPlayer = ({ url, showControls, setShowComments, nextVid }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const timeoutRef = useRef(null);

  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(-1); // -1 for auto
  const [showSettings, setShowSettings] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [eventMessage, setEventMessage] = useState("");
  const [showEventMessage, setShowEventMessage] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const playIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 5v14l11-7z" fill="white"/>
</svg>
`;

  const pauseIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/>
</svg>
`;

  const rewindIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" fill="white"/>
</svg>
`;

  const forwardIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" fill="white"/>
</svg>
`;

  const fullScreenIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="white"/>
</svg>
`;

  const pictureInPictureIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" fill="white"/>
</svg>
`;

  const muteIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="white"/>
</svg>`;

  const exitFullscreen = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="white"/>
</svg>`;

  const unmuteIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="white"/>
</svg>`;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        displayEventMessage(playIcon);
      } else {
        videoRef.current.pause();
        displayEventMessage(pauseIcon);
      }
      setIsPlaying(!videoRef.current.paused);
    }
  };

  const handleRewind = () => {
    videoRef.current.currentTime -= 10;
    displayEventMessage(rewindIcon + `<span>&nbsp10s</span>`);
  };

  const handleForward = () => {
    videoRef.current.currentTime += 10;
    displayEventMessage(forwardIcon + `<span>&nbsp10s</span>`);
  };

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      displayEventMessage(exitFullscreen);
    } else {
      playerRef.current.requestFullscreen();
      displayEventMessage(fullScreenIcon);
    }
  };

  const handlePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoRef.current.requestPictureInPicture();
      displayEventMessage(pictureInPictureIcon);
    }
  };

  const handleSpeedChange = (event) => {
    const speed = parseFloat(event.target.value);
    setSelectedSpeed(speed);
    videoRef.current.playbackRate = speed;
    displayEventMessage(`${speed}x`);
  };

  const handleVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    setVolume(volume);
    videoRef.current.volume = volume;
    console.log(videoRef.current.volume);
    displayEventMessage(`${Math.round(volume * 100)}%`);
  };

  const settingsOnChange = () => {
    setShowSettings(!showSettings);
    setShowQuality(false);
    setShowSpeed(false);
  };

  const qualityOnChange = () => {
    setShowQuality(!showQuality);
    setShowSettings(!showSettings);
  };

  const speedOnChange = () => {
    setShowSpeed(!showSpeed);
    setShowSettings(!showSettings);
  };

  const handleMute = () => {
    videoRef.current.volume = videoRef.current.volume === 0 ? 1 : 0;
    setVolume(videoRef.current.volume);
    if (videoRef.current.volume === 0) {
      displayEventMessage(muteIcon);
    } else {
      displayEventMessage(unmuteIcon);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleMouseDown = (e) => {
    setIsHolding(true);
    const timeout = setTimeout(() => {
      const rect = videoRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.right - rect.left;

      if (x < width / 3) {
        videoRef.playbackRate = 0.5;
        displayEventMessage("0.5x");
      } else if (x > (2 * width) / 3) {
        videoRef.playbackRate = 2;
        displayEventMessage("2x");
      }
    }, 1000);
    setHoldTimeout(timeout);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    clearTimeout(holdTimeout);
  };

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        const levels = hls.levels.map((level, index) => ({
          height: level.height,
          index: index,
        }));
        setQualities([{ height: "Auto", index: -1 }, ...levels]);
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        setSelectedQuality(data.level);
      });

      window.hls = hls;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.volume = volume;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleVideoEnd);

    return () => {
      if (window.hls) {
        window.hls.destroy();
        window.hls = null;
      }

      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [url]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName.toLowerCase() === "input" ||
        e.target.tagName.toLowerCase() === "textarea"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        videoRef.current.currentTime += 10;
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        videoRef.current.currentTime -= 10;
      } else if (e.code === "KeyF") {
        e.preventDefault();
        handleFullScreen();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        handleMute();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        videoRef.current.volume = Math.min(videoRef.current.volume + 0.05, 1);
        setVolume(videoRef.current.volume);
        displayEventMessage(`${Math.round(videoRef.current.volume * 100)}%`);
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        videoRef.current.volume = Math.max(videoRef.current.volume - 0.05, 0);
        setVolume(videoRef.current.volume);
        displayEventMessage(`${Math.round(videoRef.current.volume * 100)}%`);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  const handleQualityChange = (event) => {
    const levelIndex = parseInt(event.target.value, 10);
    setSelectedQuality(levelIndex);
    if (levelIndex === -1) {
      window.hls.currentLevel = -1; // Auto quality
    } else {
      window.hls.currentLevel = levelIndex;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "00:00";
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formattedHours = hours > 0 ? `${hours}:` : "";
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };

  const handleProgressClick = (e) => {
    const videoDuration = videoRef.current.duration;
    const progressWidth = progressRef.current.clientWidth;
    const clickOffsetX = e.nativeEvent.offsetX;

    videoRef.current.currentTime =
      (clickOffsetX / progressWidth) * videoDuration;

    isPlaying && videoRef.current.play();
  };

  const displayEventMessage = (message) => {
    setEventMessage(message);
    setShowEventMessage(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowEventMessage(false);
    }, 1000);
  };

  const handleTripleClick = (e) => {
    const rect = videoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.right - rect.left;

    if (x < width / 3) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setTimeout(() => {
        setShowComments(true);
      }, 50);
      // console.log("left");
    } else if (x > (2 * width) / 3) {
      // close the tab
      // window.close();
      window.location.href = "about:blank";
      console.log("right");
    } else {
      if (nextVid !== null) {
        navigate("/videopage/" + nextVid);
      } else {
        displayEventMessage("No next video");
      }
      // console.log("middle");
    }
  };

  const handleDoubleClick = (e) => {
    const vid = videoRef.current;
    const rect = vid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.right - rect.left;
    if (x < width / 3) {
      vid.currentTime -= 10;
    } else if (x > (2 * width) / 3) {
      vid.currentTime += 10;
    }
  };

  const handleSingleClick = (e) => {
    const rect = videoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.right - rect.left;

    if (x > width / 3 && x < (2 * width) / 3) {
      handlePlayPause();
    } else if (
      x > rect.left + width * 0.75 &&
      y < rect.top + (rect.bottom - rect.top) * 0.25
    ) {
      const getLocAndTemp = async () => {
        const location = await fetch(
          `https://ipinfo.io/json?token=${process.env.REACT_APP_IPINFO_TOKEN}`
        ).then((response) => response.json());
        const latLong = location.loc.split(",");

        const temp = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latLong[0]}&lon=${latLong[1]}&appid=${process.env.REACT_APP_OPENWEATHERMAP_TOKEN}`
        ).then((response) => response.json());
        // alert(
        //   `Current Location: ${location.city}, ${
        //     location.region
        //   } \nCurrent Temperature: ${(temp.main.temp - 273.15).toFixed(2)}°C`
        // );

        const tempData = JSON.parse(localStorage.getItem("tempData")) || [];

        const newData = {
          location: location.city + ", " + location.region,
          temperature: (temp.main.temp - 273.15).toFixed(2) + "°C",
          timestamp: new Date().toISOString(),
        };

        dispatch(setNotification(newData));

        tempData.push(newData);

        localStorage.setItem("tempData", JSON.stringify(tempData));
      };

      getLocAndTemp();
    }
  };

  const handleClick = (e) => {
    setClickCount((prevCount) => prevCount + 1);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        handleSingleClick(e);
      } else if (clickCount === 1) {
        handleDoubleClick(e);
      } else if (clickCount === 2) {
        handleTripleClick(e);
      }
      setClickCount(0);
    }, 300);
  };

  return (
    <div
      className="video-player-container"
      ref={playerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <video
        className="video-container"
        ref={videoRef}
        onClick={showControls ? handleClick : null}
      ></video>
      {showControls && (
        <div className="video-player-controls">
          <div
            className="progress-bar"
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className="progress"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            <div
              className="progress-bar-handle"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="video-controls-bar">
            <div className="video-controls-left">
              <MdReplay10
                size={25}
                className="video-control-btn"
                onClick={handleRewind}
              />
              {isPlaying ? (
                <MdPause
                  size={25}
                  className="video-control-btn"
                  onClick={handlePlayPause}
                />
              ) : (
                <MdPlayArrow
                  size={25}
                  className="video-control-btn"
                  onClick={handlePlayPause}
                />
              )}
              <MdForward10
                size={25}
                className="video-control-btn"
                onClick={handleForward}
              />
              <div
                className="volume-slider-container"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                {volume === 0 ? (
                  <MdVolumeOff
                    size={25}
                    className="video-control-btn"
                    onClick={handleMute}
                  />
                ) : (
                  <MdVolumeUp
                    size={25}
                    className="video-control-btn"
                    onClick={handleMute}
                  />
                )}

                {showVolumeSlider && (
                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                )}
              </div>

              <div className="video-timer">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
            <div className="video-controls-right">
              <MdSettings
                size={25}
                className="video-control-btn"
                onClick={settingsOnChange}
              />
              <MdPictureInPicture
                size={25}
                className="video-control-btn"
                onClick={handlePictureInPicture}
              />
              <MdFullscreen
                size={25}
                className="video-control-btn"
                onClick={handleFullScreen}
              />
            </div>
          </div>
          {showSettings && (
            <div className="video-settings">
              <div className="video-settings-item" onClick={qualityOnChange}>
                Quality{" "}
                {selectedQuality === -1
                  ? "Auto"
                  : qualities[selectedQuality].height}
                p
                <MdArrowRight size={12} />
              </div>
              <div className="video-settings-item" onClick={speedOnChange}>
                Speed {selectedSpeed}x <MdArrowRight size={12} />
              </div>
            </div>
          )}
          {showQuality && (
            <div className="video-quality">
              <div className="video-settings-heading">
                <MdArrowBack
                  size={16}
                  onClick={qualityOnChange}
                  className="video-back-btn"
                />
                <span>Quality</span>
              </div>
              <hr width="100%" />
              {qualities.map((quality) => (
                <div key={quality.index} className="quality-option">
                  <input
                    type="radio"
                    id={`quality-${quality.index}`}
                    name="quality"
                    value={quality.index}
                    checked={selectedQuality === quality.index}
                    onChange={handleQualityChange}
                  />
                  <label htmlFor={`quality-${quality.index}`}>
                    {quality.height}
                  </label>
                </div>
              ))}
            </div>
          )}
          {showSpeed && (
            <div className="video-speed">
              <div className="video-settings-heading">
                <MdArrowBack
                  size={16}
                  onClick={speedOnChange}
                  className="video-back-btn"
                />
                <span>Speed</span>
              </div>
              <hr width="100%" />
              {speeds.map((speed) => (
                <div key={speed} className="speed-option">
                  <input
                    type="radio"
                    id={`speed-${speed}`}
                    name="speed"
                    value={speed}
                    checked={selectedSpeed === speed}
                    onChange={handleSpeedChange}
                  />
                  <label htmlFor={`speed-${speed}`}>{speed}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showEventMessage && (
        <div
          className={`event-message ${showEventMessage ? "show" : ""}`}
          dangerouslySetInnerHTML={{ __html: eventMessage }}
        ></div>
      )}
    </div>
  );
};

export default VideoPlayer;
