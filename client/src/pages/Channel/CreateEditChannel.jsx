import React, { useState } from "react";
import "./CreateEditChannel.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import { updateChannelData } from "../../actions/channelUser";

const CreateEditChannel = ({ setEditCreateChannelBtn }) => {
  //   const CurrentUser = {
  //     result: {
  //       email: "abc@gmail.com",
  //       joinedOn: "2021-09-17T08:33:50.000Z",
  //     },
  //   };

  const CurrentUser = useSelector((state) => state.currentUserReducer);

  const [name, setName] = useState(CurrentUser?.result.name);
  const [desc, setDesc] = useState(CurrentUser?.result.desc);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Please enter a channel name");
    } else if (!desc) {
      alert("Please enter a channel description");
    } else {
      dispatch(updateChannelData(CurrentUser?.result._id, { name, desc }));
      setEditCreateChannelBtn(false);
      setTimeout(() => {
        dispatch(login({ email: CurrentUser?.result.email }));
      }, 5000);
    }
  };

  return (
    <div className="container_CreateEditChannel">
      <input
        type="submit"
        name="text"
        value={"X"}
        className="ibtn_x"
        onClick={() => setEditCreateChannelBtn(false)}
      />
      <div className="container_CreateEditChannel2">
        <h1>
          {CurrentUser?.result.name ? <>Edit</> : <>Create</>} your channel
        </h1>
        <input
          type="text"
          placeholder="Enter your channel name"
          name="text"
          className="ibox"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          type="text"
          rows={15}
          placeholder="Enter channel description"
          className="ibox"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="submit"
          onClick={handleSubmit}
          value="submit"
          className="ibtn"
        />
      </div>
    </div>
  );
};

export default CreateEditChannel;
