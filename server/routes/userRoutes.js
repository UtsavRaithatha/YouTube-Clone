import express from "express";
import { login } from "../controllers/auth.js";
import {
  updateChannelData,
  getAllChannels,
  addWatchedVideos,
} from "../controllers/channel.js";

const router = express.Router();

router.post("/login", login);
router.patch("/update/:id", updateChannelData);
router.get("/getAllChannels", getAllChannels);
router.post("/addWatchedVideos/:id", addWatchedVideos);

export default router;
