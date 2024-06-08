import videoFiles from "../models/videoFiles.js";
import mongoose from "mongoose";

export const viewsVideoController = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Video unavailable...");

  try {
    const file = await videoFiles.findById(_id);
    const views = file.views;
    const updateView = await videoFiles.findByIdAndUpdate(_id, {
      $set: {
        views: views + 1,
      },
    });

    res.status(200).json(updateView);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
