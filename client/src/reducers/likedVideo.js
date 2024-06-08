const likedVideoReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "ADD_TO_LIKED_VIDEOS":
      return { ...state, data: action?.data };
    case "GET_LIKED_VIDEOS":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default likedVideoReducer;
