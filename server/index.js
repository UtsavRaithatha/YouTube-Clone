import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
// import { v4 as uuidV4 } from "uuid";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import path from "path";
import { maintenance } from "./middleware/maintenance.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(maintenance);

const server = Server(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "https://you-tube-clone-iota-coral.vercel.app",
      "http://localhost:3000",
    ],
  },
});

let screenSharingRooms = new Map();
let userRooms = new Map();

io.on("connection", (socket) => {
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  const hours = new Date(date).getHours();

  if (hours < 18 || hours >= 24) {
    socket.disconnect();
    return;
  }

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    if (!userRooms.has(roomId)) {
      userRooms.set(roomId, new Set());
    }
    userRooms.get(roomId).add(userId);

    socket.emit("all-users", Array.from(userRooms.get(roomId)));

    socket.to(roomId).emit("user-connected", userId);

    if (screenSharingRooms.has(roomId)) {
      io.to(roomId).emit(
        "new-user-screen-share-request",
        userId,
        screenSharingRooms.get(roomId)
      );
    }

    socket.on("start-screen-share", (userId) => {
      if (!screenSharingRooms.has(roomId)) {
        screenSharingRooms.set(roomId, userId);
        io.to(roomId).emit("screen-share-started", userId);
        socket.emit("screen-share-approved");
      } else {
        socket.emit("screen-share-denied");
      }
    });

    socket.on("stop-screen-share", (userId) => {
      if (screenSharingRooms.get(roomId) === userId) {
        screenSharingRooms.delete(roomId);
        io.to(roomId).emit("screen-share-stopped", userId);
      }
    });

    socket.on("get-users", (roomId, callback) => {
      if (userRooms.has(roomId)) {
        callback(Array.from(userRooms.get(roomId)));
      } else {
        callback([]);
      }
    });

    socket.on("disconnect", () => {
      if (screenSharingRooms.get(roomId) === userId) {
        screenSharingRooms.delete(roomId);
        io.to(roomId).emit("screen-share-stopped", userId);
      }
      if (userRooms.has(roomId)) {
        userRooms.get(roomId).delete(userId);
        if (userRooms.get(roomId).size === 0) {
          userRooms.delete(roomId);
        }
      }
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

app.get("/api/check", (req, res) => {
  res.status(200).json({ message: "Server is up and running" });
});

app.use("/user", userRoutes);
app.use("/video", videoRoutes);
app.use("/comment", commentRoutes);
app.use("/verify", verifyRoutes);
app.use("/uploads", express.static(path.join("uploads")));

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
