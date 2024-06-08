const commentReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "GET_ALL_COMMENTS":
      return { ...state, data: action.payload };
    case "POST_COMMENT":
      return { ...state };
    case "EDIT_COMMENT":
      return { ...state };
    default:
      return state;
  }
};

export default commentReducer;