import axios from "axios";
const api = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

api.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err && err.response.status === 503) {
      if (window.location.pathname !== "/maintenance") {
        window.location.href = "/maintenance";
      }
    }
    return Promise.reject(err);
  }
);

export const checkApi = () => api.get("/api/check");

export const login = (authData) => api.post("/user/login", authData);

export const updateChannelData = (id, channelData) =>
  api.patch(`/user/update/${id}`, channelData);

export const fetchAllChannels = () => api.get("/user/getAllChannels");

export const uploadVideo = (fileData, fileOptions) =>
  api.post("/video/upload", fileData, fileOptions);

export const getVideos = () => api.get("/video/getVideos");

export const likeVideo = (id, like) => api.patch(`/video/like/${id}`, { like });

export const viewsVideo = (id) => api.patch(`/video/views/${id}`);

export const addToLikedVideos = (likedVideoData) =>
  api.post("/video/liked", likedVideoData);

export const getLikedVideos = () => api.get("/video/getLikedVideos");

export const deleteLikedVideo = (videoId, viewer) =>
  api.delete(`/video/deleteLiked/${videoId}/${viewer}`);

export const addToWatchLater = (watchLaterData) =>
  api.post("/video/watchLater", watchLaterData);

export const getWatchLater = () => api.get("/video/getWatchLater");

export const deleteWatchLater = (videoId, viewer) =>
  api.delete(`/video/deleteWatchLater/${videoId}/${viewer}`);

export const addToHistory = (historyData) =>
  api.post("/video/history", historyData);

export const getHistory = () => api.get("/video/getHistory");

export const clearHistory = (userId) =>
  api.delete(`/video/clearHistory/${userId}`);

export const postComment = (commentData) =>
  api.post("/comment/post", commentData);

export const deleteComment = (id) => api.delete(`/comment/delete/${id}`);

export const editComment = (id, commentBody) =>
  api.patch(`/comment/edit/${id}`, { commentBody });

export const getAllComments = () => api.get("/comment/get");

export const sendOTP = (email) => api.post("/verify/sendOTP", { email });

export const verifyOTP = (email, otp) =>
  api.post("/verify/verifyOTP", { email, otp });

export const sendOTPSMS = (phone) => api.post("/verify/sendOTP-sms", { phone });

export const verifyOTPSMS = (phone, otp) =>
  api.post("/verify/verifyOTP-sms", { phone, otp });
