import React, { useRef, useState } from "react";
import {
  MdForward10,
  MdFullscreen,
  MdPause,
  MdPictureInPicture,
  MdPlayArrow,
  MdReplay10,
  MdSettings,
  MdVolumeUp,
} from "react-icons/md";
import "./VideoPlayer.css";

const VideoPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const durationRef = useRef(null);
  const currentRef = useRef(null);
  const progressBarRef = useRef(null);

  let progressWidth = 0;

  const playVideo = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const loadData = () => {
    let duration = videoRef.current.duration;
    let totalHours = Math.floor(duration / 3600);
    let totalMinutes = Math.floor((duration % 3600) / 60);
    let totalSeconds = Math.floor(duration % 60);

    if (totalSeconds < 10) {
      totalSeconds = "0" + totalSeconds;
    }

    if (totalHours === 0) {
      durationRef.current.textContent = `${totalMinutes}:${totalSeconds}`;
    } else {
      if (totalMinutes < 10) {
        totalMinutes = "0" + totalMinutes;
      }

      durationRef.current.textContent = `${totalHours}:${totalMinutes}:${totalSeconds}`;
    }
  };

  const updateTime = () => {
    let currentTime = videoRef.current.currentTime;
    let currentHours = Math.floor(currentTime / 3600);
    let currentMinutes = Math.floor((currentTime % 3600) / 60);
    let currentSeconds = Math.floor(currentTime % 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }

    if (currentHours === 0) {
      currentRef.current.textContent = `${currentMinutes}:${currentSeconds}`;
    } else {
      if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
      }

      currentRef.current.textContent = `${currentHours}:${currentMinutes}:${currentSeconds}`;
    }

    isNaN(videoRef.current.duration)
      ? (progressWidth = 0)
      : (progressWidth = (currentTime / videoRef.current.duration) * 100);

    console.log(videoRef.current.duration);

    progressBarRef.current.style.width = `${progressWidth}%`;
    progressBarRef.current.style.setProperty(
      "--progress-position",
      `${progressWidth}%`
    );
  };

  const changeBarPosition = (e) => {
    const barWidth = progressBarRef.current.clientWidth;
    const clickPosition =
      e.clientX - progressBarRef.current.getBoundingClientRect().left;
    const clickTime = (clickPosition / barWidth) * videoRef.current.duration;

    // Check if clickTime is a finite number
    if (isFinite(clickTime)) {
      videoRef.current.currentTime = clickTime;
    }
  };

  return (
    <div className="video_player_page">
      <div className="video_player_container">
        <div id="video_player">
          <video
            src={url}
            id="main_video"
            ref={videoRef}
            onLoadedData={loadData}
            onTimeUpdate={updateTime}
          ></video>
          <div className="progress_area_time"></div>
          <div className="controls">
            <div
              className="progress_area"
              onClick={(e) => changeBarPosition(e)}
            >
              <div className="progress_bar" ref={progressBarRef}>
                <span></span>
              </div>
            </div>
            <div className="controls_list">
              <div className="controls_left">
                <span className="icon">
                  <MdReplay10
                    size={25}
                    className="fast_rewind"
                    onClick={() => {
                      videoRef.current.currentTime -= 10;
                    }}
                  />
                </span>
                <span className="icon">
                  {isPlaying ? (
                    <MdPause
                      size={25}
                      className="play_pause"
                      onClick={pauseVideo}
                    />
                  ) : (
                    <MdPlayArrow
                      size={25}
                      className="play_pause"
                      onClick={playVideo}
                    />
                  )}
                </span>
                <span className="icon">
                  <MdForward10
                    size={25}
                    className="fast_forward"
                    onClick={() => {
                      videoRef.current.currentTime += 10;
                    }}
                  />
                </span>
                <span className="icon">
                  <MdVolumeUp size={25} className="volume" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="volume_range"
                  />
                </span>
                <div className="timer">
                  <span className="current" ref={currentRef}>
                    0:00
                  </span>{" "}
                  /
                  <span className="duration" ref={durationRef}>
                    0:00
                  </span>
                </div>
              </div>
              <div className="controls_right">
                <span className="icon">
                  <i className="auto_play"></i>
                </span>
                <span className="icon">
                  <MdSettings size={25} className="settings" />
                </span>
                <span className="icon">
                  <MdPictureInPicture
                    size={25}
                    className="picture_in_picture"
                  />
                </span>
                <span className="icon">
                  <MdFullscreen size={25} className="fullscreen" />
                </span>
              </div>
            </div>
          </div>
          <div id="settings">
            <div className="playback">
              <span>Playback Speed</span>
              <ul>
                <li data-speed="0.25">0.25</li>
                <li data-speed="0.5">0.5</li>
                <li data-speed="0.75">0.75</li>
                <li data-speed="1" className="active">
                  Normal
                </li>
                <li data-speed="1.25">1.25</li>
                <li data-speed="1.5">1.5</li>
                <li data-speed="1.75">1.75</li>
                <li data-speed="2">2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
