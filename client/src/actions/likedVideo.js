import * as api from "../api";

export const addToLikedVideos = (likedVideoData) => async (dispatch) => {
  try {
    const { data } = await api.addToLikedVideos(likedVideoData);
    dispatch({ type: "ADD_TO_LIKED_VIDEOS", data });
    dispatch(getLikedVideos());
  } catch (error) {
    console.log(error);
  }
};

export const getLikedVideos = () => async (dispatch) => {
  try {
    const { data } = await api.getLikedVideos();
    dispatch({ type: "GET_LIKED_VIDEOS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteLikedVideo = (likedVideoData) => async (dispatch) => {
  try {
    const { videoId, viewer } = likedVideoData;
    await api.deleteLikedVideo(videoId, viewer);
    dispatch(getLikedVideos());
  } catch (error) {
    console.log(error);
  }
};
