import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import { app, server } from "./socket/socket.js";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// --- Middleware Configuration ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskHub API",
  });
});

app.use("/api-v1", routes);

// --- Error Handling ---
app.use((req, res) => {
  res.status(404).json({ message: "Resource Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- Database Connection & Server Start ---
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB Connected successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server & Socket.io running on port ${PORT}`);
    });
  } catch (err) {
    console.log("❌ Failed to connect to DB:", err);
    process.exit(1);
  }
};

startServer();
