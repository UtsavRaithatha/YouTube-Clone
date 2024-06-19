import React, { useEffect, useRef } from "react";
import "./VideoPlayer.css";
import Hls from "hls.js";
import Plyr from "plyr";

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  // url = server\uploads\class_activity-2.m3u8
  // url = "http://localhost:5000/uploads/master.m3u8";
  useEffect(() => {
    const video = videoRef.current;

    const defaultOptions = {};

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        const availableQualities = hls.levels.map((level) => level.height);
        defaultOptions.controls = [
          "play-large",
          "restart",
          "rewind",
          "play",
          "fast-forward",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ];

        defaultOptions.quality = {
          default: availableQualities[0],
          options: availableQualities,
          forced: true,
          onChange: (e) => {
            window.hls.levels.forEach((level, levelIndex) => {
              if (level.height === e) {
                window.hls.currentLevel = levelIndex;
              }
            });
          },
        };
        new Plyr(video, defaultOptions);
      });
      hls.attachMedia(video);
      window.hls = hls;
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      id="player"
      className="video_ShowVideo_videoPage"
      controls
    ></video>
  );
};

export default VideoPlayer;
