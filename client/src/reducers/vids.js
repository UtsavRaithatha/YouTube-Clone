const initialState = {
  vids: [],
};

const vidReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_VIDS":
      return {
        ...state,
        vids: action.payload,
      };
    default:
      return state;
  }
};

export default vidReducer;
