import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dashboardRoutes from "./routes/dashboard.js";
import uploadRoutes from "./routes/upload.js";
import logsRoutes from "./routes/logs.js";
import threatsRoutes from "./routes/threats.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add userId from auth header middleware
app.use((req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (userId) {
    req.userId = userId;
  }
  next();
});

// Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload-log", uploadRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/threats", threatsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
