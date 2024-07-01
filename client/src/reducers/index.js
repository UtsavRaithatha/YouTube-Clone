import { combineReducers } from "redux";
import authReducer from "./auth";
import currentUserReducer from "./currentUser";
import channelReducer from "./channel";
import videoReducer from "./video";
import likedVideoReducer from "./likedVideo";
import watchLaterReducer from "./watchLater";
import historyReducer from "./history";
import commentReducer from "./comments";
import verifyReducer from "./verify";
import vidReducer from "./vids";
import notificationReducer from "./notification";

export default combineReducers({
  authReducer,
  currentUserReducer,
  channelReducer,
  videoReducer,
  likedVideoReducer,
  watchLaterReducer,
  historyReducer,
  commentReducer,
  verifyReducer,
  vidReducer,
  notificationReducer,
});
