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

// GET dashboard data
router.get("/", requireAuth, async (req, res) => {
  try {
    // Get most recent uploaded log
    const uploadedLog = await prisma.uploadedLog.findFirst({
      where: {
        user_id: req.userId
      },
      orderBy: {
        uploadedAt: "desc"
      }
    });

    // If no logs uploaded, return empty data
    if (!uploadedLog) {
      return res.json({
        totalAlerts: 0,
        activeThreats: 0,
        systemHealth: 100,
        aiRiskScore: "N/A",
        lastUpdated: new Date(),
        uptime: "100%",
        hasData: false,
        tableData: null,
        fullTable: null
      });
    }

    const stored = uploadedLog.tableData || {};
    const tableData = stored.table ?? null;
    const fullTable = stored.fullTable ?? null;

    // Return data based on uploaded logs
    const dashboardData = {
      totalAlerts: uploadedLog.recordsProcessed,
      activeThreats: uploadedLog.threatsDetected,
      systemHealth: Math.max(
        90,
        100 - Math.floor((uploadedLog.threatsDetected / uploadedLog.recordsProcessed) * 100)
      ),
      aiRiskScore: uploadedLog.threatsDetected > 50 ? "High" : "Low",
      lastUpdated: uploadedLog.uploadedAt,
      uptime: "99.8%",
      hasData: true,
      tableData,
      fullTable
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
