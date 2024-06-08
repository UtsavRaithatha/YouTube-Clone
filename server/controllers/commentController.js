import comment from "../models/comment.js";
import mongoose from "mongoose";

export const postComment = async (req, res) => {
  const commentData = req.body;
  const postComment = new comment(commentData);

  try {
    await postComment.save();
    res.status(200).json("Comment posted successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const commentData = await comment.find();
    res.status(200).send(commentData);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteComment = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await comment.findByIdAndDelete(_id);

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("Comment unavailable");

    res.status(200).json({ message: "Deleted comment" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentBody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Comment unavailable");

  try {
    const updatedComment = await comment.findByIdAndUpdate(_id, {
      $set: {
        commentBody: commentBody,
      },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
