import watchLater from "../models/watchLater.js";
import mongoose from "mongoose";

export const watchLaterController = async (req, res) => {
  const watchLaterData = req.body;
  const addToWatchLater = new watchLater(watchLaterData);

  try {
    await addToWatchLater.save();
    res.status(200).json("Video added to liked videos");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWatchLaterController = async (req, res) => {
  try {
    const watchLaterData = await watchLater.find();
    res.status(200).send(watchLaterData);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteWatchLaterController = async (req, res) => {
  const { videoId, viewer } = req.params;

  try {
    await watchLater.findOneAndDelete({ videoId, viewer });
    res.status(200).json({ message: "Removed from watch later list"})
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};