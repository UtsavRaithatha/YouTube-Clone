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
  MdScreenShare,
  MdStopScreenShare,
  MdRecordVoiceOver,
  MdStop,
} from "react-icons/md";

const Stream = () => {
  const ROOM_ID = useParams().room;

  const [muteButton, setMuteButton] = useState("Mute");
  const [stopVideo, setStopVideo] = useState("Stop Video");
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isScreenShared, setIsScreenShared] = useState(false);
  // const [screenStream, setScreenStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const sharedScreenRef = useRef(null);
  const screenStreamRef = useRef(null);
  const videoGridRef = useRef(null);
  const myVideoRef = useRef(null);
  const socketRef = useRef(null);
  const myPeerRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioDestinationRef = useRef(null);
  const mixedStreamRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      secure: true,
    });
    myPeerRef.current = new Peer(undefined, {
      host: "0.peerjs.com",
      port: "443",
      secure: true,
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

        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioDestinationRef.current =
          audioContextRef.current.createMediaStreamDestination();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(audioDestinationRef.current);

        myPeerRef.current.on("call", (call) => {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              call.answer(stream);
              const video = document.createElement("video");
              video.id = call.peer;
              call.on("stream", (userVideoStream) => {
                const audioSource =
                  audioContextRef.current.createMediaStreamSource(
                    userVideoStream
                  );
                audioSource.connect(audioDestinationRef.current);
                if (call.metadata && call.metadata.type === "screenShare") {
                  addScreenShareStream(video, userVideoStream);
                } else {
                  addVideoStream(video, userVideoStream);
                }
              });
            });
        });

        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });

        socketRef.current.on("all-users", (users) => {
          users.forEach((userId) => {
            if (userId !== myPeerRef.current.id) {
              connectToNewUser(userId, myVideoStream);
            }
          });
        });

        socketRef.current.on("screen-share-started", (userId) => {
          console.log("Screen share started", userId);
          setIsScreenShared(true);
        });

        socketRef.current.on("screen-share-approved", () => {
          console.log("Screen share approved");
        });

        socketRef.current.on("screen-share-denied", () => {
          console.log("Screen share denied");
        });

        // socketRef.current.on("new-user-for-screen-share", (newUserId) => {
        //   if (screenStream) {
        //     const call = myPeerRef.current.call(newUserId, screenStream, {
        //       metadata: { type: "screenShare" },
        //     });
        //     setPeers((prevPeers) => ({
        //       ...prevPeers,
        //       [newUserId]: { ...prevPeers[newUserId], screenShareCall: call },
        //     }));
        //   }
        // });

        socketRef.current.on("screen-share-stopped", (userId) => {
          sharedScreenRef.current.innerHTML = "";
          setIsScreenShared(false);

          if (
            peers[userId] &&
            peers[userId].metadata &&
            peers[userId].metadata.type === "screenShare"
          ) {
            peers[userId].close();
            setPeers((prevPeers) => {
              const newPeers = { ...prevPeers };
              delete newPeers[userId];
              return newPeers;
            });
          }
        });

        socketRef.current.on(
          "new-user-screen-share-request",
          (userId, screenSharerId) => {
            setIsScreenShared(true);
            if (screenSharerId === myPeerRef.current.id) {
              // console.log("YES");
              const call = myPeerRef.current.call(
                userId,
                screenStreamRef.current,
                {
                  metadata: { type: "screenShare" },
                }
              );
              setPeers((prevPeers) => ({
                ...prevPeers,
                [userId]: { ...prevPeers[userId], screenShareCall: call },
              }));
            }
          }
        );

        socketRef.current.on("user-disconnected", (userId) => {
          if (peers[userId]) {
            peers[userId].close();
          }
          removeVideoStream(userId);
        });
      });

    myPeerRef.current.on("open", (id) => {
      setTimeout(() => {
        socketRef.current.emit("join-room", ROOM_ID, id);
      }, 1000);
    });

    return () => {
      socketRef.current.disconnect();
      myPeerRef.current.destroy();
    };
  }, []);

  const connectToNewUser = async (userId, stream) => {
    try {
      const call = myPeerRef.current.call(userId, stream);

      if (!call) {
        console.error(`Failed to create call for user: ${userId}`);
        return;
      }

      const video = document.createElement("video");
      video.id = userId;

      call.on("stream", (userVideoStream) => {
        const audioSource =
          audioContextRef.current.createMediaStreamSource(userVideoStream);
        audioSource.connect(audioDestinationRef.current);
        addVideoStream(video, userVideoStream);
      });

      call.on("close", () => {
        video.remove();
      });

      call.on("error", (err) => {
        console.error(`Error in call with user ${userId}:`, err);
      });

      setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
    } catch (error) {
      console.error(`Error connecting to user ${userId}:`, error);
    }
  };

  const addVideoStream = (video, stream) => {
    console.log("Stream", stream);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGridRef.current.append(video);
  };

  const addScreenShareStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    setIsScreenShared(true);
    sharedScreenRef.current.innerHTML = "";
    sharedScreenRef.current.append(video);
  };

  const removeVideoStream = (userId) => {
    const videoElement = document.getElementById(userId);
    if (videoElement) {
      videoElement.remove();
    }
  };

  const startScreenShare = () => {
    socketRef.current.emit("start-screen-share", myPeerRef.current.id);

    socketRef.current.once("screen-share-approved", () => {
      navigator.mediaDevices
        .getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: true,
        })
        .then((stream) => {
          setScreenSharing(true);
          // setScreenStream(stream);
          screenStreamRef.current = stream;
          const screenVideo = document.createElement("video");
          screenVideo.srcObject = stream;
          screenVideo.id = `screen-${myPeerRef.current.id}`;
          screenVideo.addEventListener("loadedmetadata", () => {
            screenVideo.play();
          });
          sharedScreenRef.current.innerHTML = "";
          sharedScreenRef.current.append(screenVideo);

          socketRef.current.emit("get-users", ROOM_ID, (users) => {
            users.forEach((userId) => {
              if (userId !== myPeerRef.current.id) {
                const call = myPeerRef.current.call(userId, stream, {
                  metadata: { type: "screenShare" },
                });
                setPeers((prevPeers) => ({
                  ...prevPeers,
                  [userId]: { ...prevPeers[userId], screenShareCall: call },
                }));
              }
            });
          });

          stream.getVideoTracks()[0].onended = () => {
            stopScreenShare();
          };
        })
        .catch((error) => {
          console.error("Error starting screen share:", error);
          stopScreenShare();
        });
    });

    socketRef.current.once("screen-share-denied", () => {
      alert("Screen sharing is already in progress");
    });
  };

  const stopScreenShare = () => {
    setScreenSharing(false);

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // setScreenStream(null);
    screenStreamRef.current = null;
    socketRef.current.emit("stop-screen-share", myPeerRef.current.id);
    Object.values(peers).forEach((peer) => {
      if (peer.metadata && peer.metadata.type === "screenShare") {
        peer.close();
      }
    });
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
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
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
    Object.values(peers).forEach((peer) => {
      if (typeof peer.close === "function") {
        peer.close();
      }
    });
    setPeers({});

    if (myVideoStream) {
      myVideoStream.getTracks().forEach((track) => track.stop());
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    if (videoGridRef.current) {
      videoGridRef.current.innerHTML = "";
    }

    navigate("/");
    window.location.reload();
  };

  const handleVideoClick = (event) => {
    const videoElement = event.target.closest("video");
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        // Safari
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        // IE11
        videoElement.msRequestFullscreen();
      }
    }
  };

  const startRecording = async () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, preferCurrentTab: true })
      .then((stream) => {
        const mixedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...audioDestinationRef.current.stream.getAudioTracks(),
        ]);
        mixedStreamRef.current = mixedStream;
        const mediaRecorder = new MediaRecorder(mixedStream, {
          mimeType: "video/webm",
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          setRecording(false);
        };

        mediaRecorder.start();
        setMediaRecorder(mediaRecorder);
        setRecording(true);
      })
      .catch((error) => {
        console.error("Error starting recording:", error);
      });
  };

  const stopRecording = () => {
    mediaRecorder.stop();

    if (mixedStreamRef.current) {
      mixedStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    setRecordedChunks([]);
    setRecording(false);
  };

  useEffect(() => {
    if (mediaRecorder && recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = `recording-${ROOM_ID}.webm`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  return (
    <div className="stream">
      <div className="video-grid-shared-screen">
        <div
          // id="video-grid-left"
          id={isScreenShared ? "video-grid-left" : "video-grid"}
          ref={videoGridRef}
          onClick={handleVideoClick}
        ></div>
        <div
          className={isScreenShared ? "shared-screen" : ""}
          ref={sharedScreenRef}
        ></div>
      </div>
      <div className="video-call-controls">
        <div className="video-call-audio-video">
          <div
            onClick={muteUnmute}
            className={`video-call-mute-button ${
              muteButton === "Unmute" ? "control-off" : ""
            }`}
          >
            {muteButton === "Mute" ? (
              <MdMic size={24} className="video-call-btns" />
            ) : (
              <MdMicOff size={24} className="video-call-btns" />
            )}
            <span>Audio</span>
          </div>
          <div
            onClick={playStop}
            className={`video-call-video-button ${
              stopVideo === "Play Video" ? "control-off" : ""
            }`}
          >
            {stopVideo === "Stop Video" ? (
              <MdVideocam size={24} className="video-call-btns" />
            ) : (
              <MdVideocamOff size={24} className="video-call-btns" />
            )}
            <span>Video</span>
          </div>
        </div>

        <div
          onClick={screenSharing ? stopScreenShare : startScreenShare}
          className="video-call-screen-share"
        >
          {screenSharing ? (
            <MdStopScreenShare size={24} className="video-call-btns" />
          ) : (
            <MdScreenShare size={24} className="video-call-btns" />
          )}
          <span>{screenSharing ? "Stop Share" : "Share Screen"}</span>
        </div>

        <div className="meeting-info">
          <span className="meeting-id">Meeting ID: {ROOM_ID}</span>
          <MdContentCopy
            size={20}
            onClick={() => copyToClipboard(ROOM_ID)}
            className="copy-meeting-id"
          />
        </div>

        <div
          onClick={recording ? stopRecording : startRecording}
          className="video-call-record"
        >
          {recording ? (
            <MdStop size={24} className="video-call-btns" />
          ) : (
            <MdRecordVoiceOver size={24} className="video-call-btns" />
          )}
          <span>{recording ? "Stop Recording" : "Start Recording"}</span>
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
