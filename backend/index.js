import cors from "cors";
import dotenv from "dotenv";
import express from "express"; // این برای تایپ‌ها یا میدلورهاست، اما app را از پایین می‌گیریم
import mongoose from "mongoose";
import morgan from "morgan";

// 👇 تغییر ۱: ایمپورت کردن app و server از فایل سوکت
import { app, server } from "./socket/socket.js";
import routes from "./routes/index.js";

dotenv.config();

// ❌ حذف این خط: const app = express();
// چون app را از فایل socket.js ایمپورت کردیم

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

// --- Database Connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected successfully"))
  .catch((err) => console.log("Failed to connect to DB:", err));

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

// --- Start Server ---
// 👇 تغییر ۲: استفاده از server.listen به جای app.listen
server.listen(PORT, () => {
  console.log(`Server & Socket.io running on port ${PORT}`);
});
