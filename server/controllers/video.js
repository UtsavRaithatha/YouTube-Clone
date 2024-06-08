import videoFiles from "../models/videoFiles.js";

export const uploadVideo = async (req, res, next) => {
  if (req.file === undefined)
    res.status(400).json({ message: "Please upload a video file!" });
  else {
    try {
      const file = new videoFiles({
        videoTitle: req.body.title,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        videoChannel: req.body.channel,
        uploader: req.body.uploader,
      });

      await file.save();

      res.status(201).send("Video uploaded successfully!");
    } catch (error) {
      res.status(400).send(error);
    }
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await videoFiles.find();
    res.status(200).send(videos);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
