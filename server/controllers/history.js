import history from "../models/history.js";
import mongoose from "mongoose";

export const historyController = async (req, res) => {
  const historyData = req.body;
  const addToHistory = new history(historyData);

  try {
    await addToHistory.save();
    res.status(200).json("Video added to liked videos");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getHistoryController = async (req, res) => {
  try {
    const historyData = await history.find();
    res.status(200).send(historyData);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const clearHistoryController = async (req, res) => {
  const { userId } = req.params;

  try {
    await history.deleteMany({ viewer: userId });
    res.status(200).json({ message: "Removed from watch later list" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
