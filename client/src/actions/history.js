import * as api from "../api";

export const addToHistory = (historyData) => async (dispatch) => {
  try {
    const { data } = await api.addToHistory(historyData);
    dispatch({ type: "ADD_TO_HISTORY", data });
    dispatch(getHistory());
  } catch (error) {
    console.log(error);
  }
};

export const getHistory = () => async (dispatch) => {
  try {
    const { data } = await api.getHistory();
    dispatch({ type: "GET_HISTORY", payload: data });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const clearHistory = (historyData) => async (dispatch) => {
  try {
    const { userId } = historyData;
    await api.clearHistory(userId);
    dispatch(getHistory());
  } catch (error) {
    console.log(error);
  }
};
