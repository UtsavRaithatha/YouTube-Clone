const historyReducer = (state = { data: null }, action) => {
    switch (action.type) {
        case "GET_HISTORY":
        return { ...state, data: action.payload };
        case "ADD_TO_HISTORY":
        return { ...state, data: action?.data };
        default:
        return state;
    }
};

export default historyReducer;
