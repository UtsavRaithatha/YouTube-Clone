import * as api from "../api";

export const fetchAllChannels = () => async (dispatch) => {
  try {
    const { data } = await api.fetchAllChannels();

    dispatch({ type: "FETCH_CHANNELS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateChannelData = (id, channelData) => async (dispatch) => {
  try {
    const { data } = await api.updateChannelData(id, channelData);

    dispatch({ type: "UPDATE_DATA", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const addWatchedVideos = (id, videoId) => async (dispatch) => {
  try {
    const { data } = await api.addWatchedVideos(id, videoId);
    dispatch({ type: "ADD_WATCHED_VIDEOS", payload: data });
    // dispatch(fetchAllChannels());
  } catch (error) {
    console.log(error);
  }
};
