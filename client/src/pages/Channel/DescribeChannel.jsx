import React from "react";
import { FaEdit, FaUpload } from "react-icons/fa";
import "./DescribeChannel.css";
import { useSelector } from "react-redux";

const DescribeChannel = ({
  setEditCreateChannelBtn,
  cid,
  setVidUploadPage,
}) => {
  const channels = useSelector((state) => state?.channelReducer);

  const currentChannel = channels.filter((channel) => channel._id === cid)[0];

  const currentUser = useSelector((state) => state?.currentUserReducer);

  return (
    <div className="container3_channel">
      <div className="channel_logo_channel">
        <b>{currentChannel?.name.charAt(0).toUpperCase()}</b>
      </div>
      <div className="description_channel">
        <b>{currentChannel?.name}</b>
        <p>{currentChannel?.desc}</p>
      </div>
      {currentUser?.result._id === currentChannel?._id && (
        <>
          <div
            className="editbtn_channel"
            onClick={() => {
              setEditCreateChannelBtn(true);
            }}
          >
            <FaEdit />
            <b>Edit Channel</b>
          </div>
          <div
            className="uploadbtn_channel"
            onClick={() => setVidUploadPage(true)}
          >
            <FaUpload />
            <b>Upload Video</b>
          </div>
        </>
      )}
    </div>
  );
};

export default DescribeChannel;
