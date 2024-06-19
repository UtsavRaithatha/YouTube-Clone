const channelReducer = (states = [], action) => {
  switch (action.type) {
    case "UPDATE_DATA":
      return states.map((state) =>
        state._id === action.payload._id ? action.payload : state
      );
    case "FETCH_CHANNELS":
      return action.payload;
    case "ADD_WATCHED_VIDEOS":
      return states.map((state) =>
        state._id === action.payload._id ? action.payload : state
      );
    default:
      return states;
  }
};

export default channelReducer;
