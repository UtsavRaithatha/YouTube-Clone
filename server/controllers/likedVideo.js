import likedVideo from "../models/likedVideo.js";
import mongoose from "mongoose";

export const likedVideoController = async (req, res) => {
  const likedVideoData = req.body;
  const addToLikedVideos = new likedVideo(likedVideoData);

  try {
    await addToLikedVideos.save();
    res.status(200).json("Video added to liked videos");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLikedVideosController = async (req, res) => {
  try {
    const likedVideos = await likedVideo.find();
    res.status(200).send(likedVideos);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteLikedVideoController = async (req, res) => {
  const { videoId, viewer } = req.params;

  try {
    await likedVideo.findOneAndDelete({ videoId, viewer });
    res.status(200).json({ message: "Removed from liked videos" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
