import * as api from "../api";

export const uploadVideo = (videoData) => async (dispatch) => {
  try {
    const { fileData, fileOptions } = videoData;
    const { data } = await api.uploadVideo(fileData, fileOptions);
    dispatch({ type: "UPLOAD_VIDEO" });
    dispatch(getVideos());
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getVideos = () => async (dispatch) => {
  try {
    const { data } = await api.getVideos();
    dispatch({ type: "GET_VIDEOS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const likeVideo = (likeData) => async (dispatch) => {
  try {
    const { id, like } = likeData;
    const { data } = await api.likeVideo(id, like);
    dispatch({ type: "POST_LIKE", payload: data });
    dispatch(getVideos());
  } catch (error) {
    console.log(error);
  }
};

export const viewsVideo = (viewsData) => async (dispatch) => {
  try {
    const { videoId: id } = viewsData;
    const { data } = await api.viewsVideo(id);
    dispatch({ type: "POST_VIEWS", data });
    dispatch(getVideos());
  } catch (error) {
    console.log(error);
  }
};
