import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check auth
const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// GET user logs
router.get("/", requireAuth, async (req, res) => {
  try {
    const logs = await prisma.uploadedLog.findMany({
      where: {
        user_id: req.userId
      },
      orderBy: {
        uploadedAt: "desc"
      }
    });

    res.json(logs);
  } catch (error) {
    console.error("Logs API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
