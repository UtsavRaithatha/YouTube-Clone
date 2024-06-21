import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import videoFiles from "../models/videoFiles.js";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const uploadVideo = async (req, res) => {
  if (req.file === undefined) {
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
    { resolution: "360p", videoBitrate: "800k", audioBitrate: "96k" },
    { resolution: "480p", videoBitrate: "1400k", audioBitrate: "128k" },
    { resolution: "720p", videoBitrate: "2800k", audioBitrate: "128k" },
    { resolution: "1080p", videoBitrate: "5000k", audioBitrate: "192k" },
  ];

  const playlistEntries = [];

  const inputFilePath = path.resolve(req.file.path);

  try {
    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
      const ffmpegCommand = `ffmpeg -i "${inputFilePath}" \
        -vf "scale=w=${getVideoWidth(resolution)}:h=${getVideoHeight(
        resolution
      )}:force_original_aspect_ratio=decrease,pad=${getVideoWidth(
        resolution
      )}:${getVideoHeight(resolution)}:(ow-iw)/2:(oh-ih)/2" \
        -c:v h264 -profile:v main -g 48 -keyint_min 48 -b:v ${videoBitrate} -maxrate ${getMaxVideoBitrate(
        videoBitrate
      )} -bufsize ${getBufferSize(videoBitrate)} \
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
        `#EXT-X-STREAM-INF:BANDWIDTH=${getBitrateKbps(
          videoBitrate
        )},RESOLUTION=${getVideoWidth(resolution)}x${getVideoHeight(
          resolution
        )}\n${resolution}.m3u8`
      );
    }

    const masterPlaylistContent = `#EXTM3U\n${playlistEntries.join("\n")}`;
    fs.writeFileSync(
      path.join(outputDir, "master.m3u8"),
      masterPlaylistContent
    );

    const file = new videoFiles({
      videoTitle: req.body.title,
      // fileName: `${videoName}.m3u8`,
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

function getVideoWidth(resolution) {
  switch (resolution) {
    case "360p":
      return 640;
    case "480p":
      return 854;
    case "720p":
      return 1280;
    case "1080p":
      return 1920;
    default:
      return 640;
  }
}

function getVideoHeight(resolution) {
  switch (resolution) {
    case "360p":
      return 360;
    case "480p":
      return 480;
    case "720p":
      return 720;
    case "1080p":
      return 1080;
    default:
      return 360;
  }
}

function getMaxVideoBitrate(videoBitrate) {
  switch (videoBitrate) {
    case "800k":
      return "856k";
    case "1400k":
      return "1498k";
    case "2800k":
      return "2996k";
    case "5000k":
      return "5350k";
    default:
      return "856k";
  }
}

function getBufferSize(videoBitrate) {
  switch (videoBitrate) {
    case "800k":
      return "1200k";
    case "1400k":
      return "2100k";
    case "2800k":
      return "4200k";
    case "5000k":
      return "7500k";
    default:
      return "1200k";
  }
}

function getBitrateKbps(videoBitrate) {
  return parseInt(videoBitrate, 10);
}

export const getVideos = async (req, res) => {
  try {
    const videos = await videoFiles.find();
    res.status(200).send(videos);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
