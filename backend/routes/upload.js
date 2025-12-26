import express from "express";
import { uploadFile } from "../controllers/upload.js";
import upload from "../middleware/upload-middleware.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadFile);

export default router;
