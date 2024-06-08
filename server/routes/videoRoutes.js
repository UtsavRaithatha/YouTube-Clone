import express from "express";
import { uploadVideo, getVideos } from "../controllers/video.js";
import { likeVideo } from "../controllers/like.js";
import {
  likedVideoController,
  getLikedVideosController,
  deleteLikedVideoController,
} from "../controllers/likedVideo.js";
import { viewsVideoController } from "../controllers/views.js";
import {
  watchLaterController,
  getWatchLaterController,
  deleteWatchLaterController,
} from "../controllers/watchLater.js";
import {
  historyController,
  getHistoryController,
  clearHistoryController,
} from "../controllers/history.js";

import auth from "../middleware/auth.js";

import upload from "../helpers/fileHelpers.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadVideo);
router.get("/getVideos", getVideos);
router.patch("/views/:id", viewsVideoController);

router.patch("/like/:id", auth, likeVideo);
router.post("/liked", auth, likedVideoController);
router.get("/getLikedVideos", getLikedVideosController);
router.delete("/deleteLiked/:videoId/:viewer", auth, deleteLikedVideoController);

router.post("/watchLater", auth, watchLaterController);
router.get("/getWatchLater", getWatchLaterController);
router.delete("/deleteWatchLater/:videoId/:viewer", auth, deleteWatchLaterController);

router.post("/history", auth, historyController);
router.get("/getHistory", getHistoryController);
router.delete("/clearHistory/:userId", auth, clearHistoryController);

export default router;
