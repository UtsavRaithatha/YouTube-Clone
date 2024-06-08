import videoFiles from "../models/videoFiles.js";
import mongoose from "mongoose";

export const likeVideo = async (req, res) => {
  const { id: _id } = req.params;
  const { like } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Video unavailable...");

  try {
    const updateLike = await videoFiles.findByIdAndUpdate(_id, {
      $set: {
        "like": like,
      },
    });

    res.status(200).json(updateLike);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
