import express from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import multer from 'multer';
import FormData from 'form-data';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Middleware to check auth
const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// SIMPLIFIED POST - Upload and analyze log file
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const name = req.file.originalname
    const size = req.file.size
    if (!['log', 'test', 'csv'].includes(ext)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Forward as multipart form — exactly what the AI service expects
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/predict-new`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 30000,
      }
    );

    const uploadedLog = await prisma.uploadedLog.create({
      data: {
        user_id: req.userId,
        fileName: name,
        fileSize: size,
        recordsProcessed: aiResponse.data.total_records,
        threatsDetected: aiResponse.data.malicious_count,
        tableData: {
          table: aiResponse.data.table,
          fullTable: aiResponse.data.full_table
        },
        uploadedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "File uploaded and analyzed successfully",
      data: {
        id: uploadedLog.id,
        fileName: uploadedLog.fileName,
        fileSize: uploadedLog.fileSize,
        recordsProcessed: uploadedLog.recordsProcessed,
        threatsDetected: uploadedLog.threatsDetected,
        uploadedAt: uploadedLog.uploadedAt
      },
      recordsProcessed: uploadedLog.recordsProcessed,
      threatsDetected: uploadedLog.threatsDetected,
      tableData: aiResponse.data.table,
      fullTable: aiResponse.data.full_table
    });

  } catch (processingError) {
    console.error("Upload processing error:", processingError.message);
    const status = processingError.response?.status || 500;
    const detail = processingError.response?.data?.detail || processingError.message || "Upload processing failed";
    res.status(status).json({
      success: false,
      error: "Upload processing failed",
      message: detail
    });
  }
});

// GET - List user uploads
router.get("/", requireAuth, async (req, res) => {
  try {
    const uploads = await prisma.uploadedLog.findMany({
      where: {
        user_id: req.userId
      },
      orderBy: {
        uploadedAt: "desc"
      }
    });

    res.json(uploads);
  } catch (error) {
    console.error("Get uploads error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
