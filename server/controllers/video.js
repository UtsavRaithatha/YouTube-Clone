import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import videoFiles from "../models/videoFiles.js";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a video file!" });
  }

  if (req.file.mimetype !== "video/mp4") {
    return res.status(400).json({ message: "Please upload a video file!" });
  }

  const videoName =
    new Date().toISOString().replace(/:/g, "-") +
    path.parse(req.file.originalname).name;
  const outputDir = path.resolve(`uploads/${videoName}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const resolutions = [
    {
      resolution: "360p",
      width: 640,
      height: 360,
      videoBitrate: "800k",
      audioBitrate: "96k",
      maxBitrate: "856k",
      bufsize: "1200k",
    },
    {
      resolution: "480p",
      width: 854,
      height: 480,
      videoBitrate: "1400k",
      audioBitrate: "128k",
      maxBitrate: "1498k",
      bufsize: "2100k",
    },
    {
      resolution: "720p",
      width: 1280,
      height: 720,
      videoBitrate: "2800k",
      audioBitrate: "128k",
      maxBitrate: "2996k",
      bufsize: "4200k",
    },
    {
      resolution: "1080p",
      width: 1920,
      height: 1080,
      videoBitrate: "5000k",
      audioBitrate: "192k",
      maxBitrate: "5350k",
      bufsize: "7500k",
    },
  ];

  const playlistEntries = [];
  const inputFilePath = path.resolve(req.file.path);

  try {
    for (const {
      resolution,
      width,
      height,
      videoBitrate,
      audioBitrate,
      maxBitrate,
      bufsize,
    } of resolutions) {
      const ffmpegCommand = `ffmpeg -i "${inputFilePath}" \
        -vf "scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2" \
        -c:v h264 -profile:v main -g 48 -keyint_min 48 -b:v ${videoBitrate} -maxrate ${maxBitrate} -bufsize ${bufsize} \
        -c:a aac -ac 2 -ar 44100 -b:a ${audioBitrate} \
        -var_stream_map "v:0,a:0" \
        -hls_time 6 -hls_list_size 0 \
        -hls_segment_filename "${outputDir}/${resolution}_%03d.ts" "${outputDir}/${resolution}.m3u8"`;

      await new Promise((resolve, reject) => {
        exec(ffmpegCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`ffmpeg error (${resolution}): ${error.message}`);
            return reject(
              new Error(`ffmpeg error (${resolution}): ${error.message}`)
            );
          }
          console.log(`ffmpeg stdout (${resolution}): ${stdout}`);
          console.error(`ffmpeg stderr (${resolution}): ${stderr}`);
          resolve();
        });
      });

      playlistEntries.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${
          parseInt(videoBitrate, 10) * 1000
        },RESOLUTION=${width}x${height}\n${resolution}.m3u8`
      );
    }

    const masterPlaylistContent = `#EXTM3U\n${playlistEntries.join("\n")}`;
    fs.writeFileSync(
      path.join(outputDir, "master.m3u8"),
      masterPlaylistContent
    );

    const file = new videoFiles({
      videoTitle: req.body.title,
      filePath: `uploads/${videoName}/master.m3u8`,
      fileType: "application/x-mpegURL",
      fileSize: req.file.size,
      videoChannel: req.body.channel,
      uploader: req.body.uploader,
    });

    await file.save();

    fs.unlink(inputFilePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${err.message}`);
      } else {
        console.log("File deleted successfully!");
      }
    });

    res.status(201).send("Video uploaded and converted successfully!");
  } catch (error) {
    res.status(500).send(error.message);
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
