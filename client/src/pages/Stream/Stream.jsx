import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { useNavigate, useParams } from "react-router-dom";
import "./Stream.css";
import {
  MdContentCopy,
  MdExitToApp,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";

const Stream = () => {
  const ROOM_ID = useParams().room;

  const [muteButton, setMuteButton] = useState("Mute");
  const [stopVideo, setStopVideo] = useState("Stop Video");
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [peers, setPeers] = useState({});
  const videoGridRef = useRef(null);
  const myVideoRef = useRef(null);
  const socketRef = useRef(null);
  const myPeerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, { secure: true });
    myPeerRef.current = new Peer(undefined, {
      path: "/peerjs",
      host: "/",
      port: "443",
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setMyVideoStream(stream);
        myVideoRef.current = document.createElement("video");
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.muted = true;
        myVideoRef.current.setAttribute("class", "my-video");
        myVideoRef.current.id = "myVideo";
        myVideoRef.current.addEventListener("loadedmetadata", () => {
          myVideoRef.current.play();
        });
        videoGridRef.current.append(myVideoRef.current);

        myPeerRef.current.on("call", (call) => {
          console.log("Answering call");
          call.answer(stream);
          const video = document.createElement("video");
          video.id = call.peer;
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socketRef.current.on("user-disconnected", (userId) => {
      if (peers[userId]) {
        peers[userId].close();
      }
      removeVideoStream(userId);
    });

    myPeerRef.current.on("open", (id) => {
      setTimeout(() => {
        console.log("Joining room");
        socketRef.current.emit("join-room", ROOM_ID, id);
      }, 1000);
    });

    return () => {
      socketRef.current.disconnect();
      myPeerRef.current.destroy();
    };
  }, []);

  const connectToNewUser = (userId, stream) => {
    console.log("New user connected");
    const call = myPeerRef.current.call(userId, stream);
    const video = document.createElement("video");
    video.id = userId;
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      removeVideoStream(userId);
    });
    setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
  };

  const addVideoStream = (video, stream) => {
    console.log("Adding video stream");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGridRef.current.append(video);
  };

  const removeVideoStream = (userId) => {
    const videoElement = document.getElementById(userId);
    if (videoElement) {
      videoElement.remove();
    }
  };

  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setMuteButton("Unmute");
    } else {
      setMuteButton("Mute");
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  };

  const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setStopVideo("Play Video");
    } else {
      setStopVideo("Stop Video");
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const leaveCall = () => {
    // Close all peer connections
    Object.values(peers).forEach((peer) => peer.close());
    setPeers({});

    // Stop all media tracks
    if (myVideoStream) {
      myVideoStream.getTracks().forEach((track) => track.stop());
    }

    // Disconnect from the socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Clear video grid
    if (videoGridRef.current) {
      videoGridRef.current.innerHTML = "";
    }

    // Navigate back to home
    navigate("/");
  };

  return (
    <div className="stream">
      <div id="video-grid" ref={videoGridRef}></div>
      <div className="video-call-controls">
        <div className="video-call-audio-video">
          <div
            onClick={muteUnmute}
            className={`video-call-mute-button ${
              muteButton === "Unmute" && "control-off"
            }`}
          >
            {muteButton === "Mute" ? (
              <>
                <MdMic size={24} className="video-call-btns" />
              </>
            ) : (
              <>
                <MdMicOff size={24} className="video-call-btns" />
              </>
            )}
            <span>Audio</span>
          </div>
          <div
            onClick={playStop}
            className={`video-call-video-button ${
              stopVideo === "Play Video" && "control-off"
            }`}
          >
            {stopVideo === "Stop Video" ? (
              <>
                <MdVideocam size={24} className="video-call-btns" />
              </>
            ) : (
              <>
                <MdVideocamOff size={24} className="video-call-btns" />
              </>
            )}
            <span>Video</span>
          </div>
        </div>
        <div className="meeting-info">
          <span className="meeting-id">Meeting ID: {ROOM_ID}</span>
          <MdContentCopy
            size={20}
            onClick={() => copyToClipboard(ROOM_ID)}
            className="copy-meeting-id"
          />
        </div>
        <div className="leave-meeting" onClick={leaveCall}>
          <MdExitToApp size={24} className="leave-meeting-btn" />
          <span>End Call</span>
        </div>
      </div>
    </div>
  );
};

export default Stream;
