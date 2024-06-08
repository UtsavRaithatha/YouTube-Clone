const watchLaterReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "ADD_TO_WATCH_LATER":
      return { ...state, data: action?.data };
    case "GET_WATCH_LATER":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default watchLaterReducer;
