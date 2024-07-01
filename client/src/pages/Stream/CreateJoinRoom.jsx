import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import "./CreateJoinRoom.css";

const CreateJoinRoom = () => {
  const [roomId, setRoomId] = React.useState("");

  return (
    <div className="create-join-room-container">
      <div className="create-join-room-container-2">
        <h1 className="room-title">Create or Join a Room</h1>
        <Link to={`/stream/${uuidv4()}`} className="room-link">
          Create Room
        </Link>
        <span className="room-or">OR</span>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          className="room-input"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Link to={`/stream/${roomId}`} className="room-link">
          Join Room
        </Link>
      </div>
    </div>
  );
};

export default CreateJoinRoom;
