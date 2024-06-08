import * as api from "../api";

export const addToWatchLater = (watchLaterData) => async (dispatch) => {
  try {
    const { data } = await api.addToWatchLater(watchLaterData);
    dispatch({ type: "ADD_TO_WATCH_LATER", data });
    dispatch(getWatchLater());
  } catch (error) {
    console.log(error);
  }
};

export const getWatchLater = () => async (dispatch) => {
  try {
    const { data } = await api.getWatchLater();
    dispatch({ type: "GET_WATCH_LATER", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteWatchLater = (watchLaterData) => async (dispatch) => {
  try {
    const { videoId, viewer } = watchLaterData;
    await api.deleteWatchLater(videoId, viewer);
    dispatch(getWatchLater());
  } catch (error) {
    console.log(error);
  }
};
