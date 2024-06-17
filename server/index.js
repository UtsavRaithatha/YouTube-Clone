import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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

app.get("/", (req, res) => {
  res.send("Hello World");
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

app.listen(PORT, () => {
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
