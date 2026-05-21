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

// GET user threats
router.get("/", requireAuth, async (req, res) => {
  try {
    const threats = await prisma.uploadedLog.findMany({
      where: {
        user_id: req.userId
      },
      orderBy: {
        uploadedAt: "desc"
      }
    });

    res.json(threats);
  } catch (error) {
    console.error("Threats API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
