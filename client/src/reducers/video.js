const videoReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "UPLOAD_VIDEO":
      return { ...state };
    case "POST_VIEWS":
      return { ...state };
    case "GET_VIDEOS":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default videoReducer;
