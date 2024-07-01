const initialState = {
  tempData: JSON.parse(localStorage.getItem("tempData")) || [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return {
        ...state,
        tempData: [...state.tempData, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        tempData: state.tempData.filter((item) => item.timestamp !== action.payload),
      };
    default:
      return state;
  }
};

export default notificationReducer;
