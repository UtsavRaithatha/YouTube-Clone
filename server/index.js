import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
// import { v4 as uuidV4 } from "uuid";
import { ExpressPeerServer } from "peer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";
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
    origin: "*",
  },
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    // messages
    // socket.on("message", (message) => {
    //   //send message to the same room
    //   io.to(roomId).emit("createMessage", message);
    // });

    socket.on("screen-share", (streamId) => {
      io.to(roomId).emit("receive-screen-stream", streamId);
    });

    socket.on("stop-screen-share", () => {
      io.to(roomId).emit("stop-screen-share");
    });

    socket.on("disconnect", () => {
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
app.use("/stream", streamRoutes);
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

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import { ExpressPeerServer } from "peer";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import userRoutes from "./routes/userRoutes.js";
// import videoRoutes from "./routes/videoRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
// import verifyRoutes from "./routes/verifyRoutes.js";
// import streamRoutes from "./routes/streamRoutes.js";
// import path from "path";
// import { maintenance } from "./middleware/maintenance.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json({ limit: "30mb", extended: true }));
// app.use(express.urlencoded({ limit: "30mb", extended: true }));

// app.use(maintenance);

// const server = http.createServer(app);

// const peerServer = ExpressPeerServer(server, {
//   debug: true,
// });

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// app.use("/peerjs", peerServer);

// io.on("connection", (socket) => {
//   socket.on("join-room", (roomId, userId) => {
//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("user-connected", userId);
//   });
// });

// app.get("/api/check", (req, res) => {
//   res.status(200).json({ message: "Server is up and running" });
// });

// app.use("/user", userRoutes);
// app.use("/video", videoRoutes);
// app.use("/comment", commentRoutes);
// app.use("/verify", verifyRoutes);
// app.use("/stream", streamRoutes);
// app.use("/uploads", express.static(path.join("uploads")));

// const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const DB_URL = process.env.DB_URL;

// mongoose
//   .connect(DB_URL)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log("Error connecting to MongoDB", err);
//   });
