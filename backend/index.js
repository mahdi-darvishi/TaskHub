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

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-hub-frontend-coral.vercel.app",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((o) => o && origin.startsWith(o.replace(/\/$/, "")))
      ) {
        callback(null, true);
      } else {
        console.log("❌ CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskHub API",
    env_frontend: process.env.FRONTEND_URL,
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
export default app;
