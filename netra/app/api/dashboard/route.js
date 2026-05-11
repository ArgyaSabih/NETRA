import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Check if user has uploaded any logs
    const uploadedLog = await prisma.uploadedLog.findFirst({
      where: {
        user_id: session.user.id
      }
    });

    // If no logs uploaded, return empty data
    if (!uploadedLog) {
      return NextResponse.json({
        totalAlerts: 0,
        activeThreats: 0,
        systemHealth: 100,
        aiRiskScore: "N/A",
        lastUpdated: new Date(),
        uptime: "100%",
        hasData: false
      });
    }

    // Return data based on uploaded logs
    const dashboardData = {
      totalAlerts: uploadedLog.recordsProcessed,
      activeThreats: uploadedLog.threatsDetected,
      systemHealth: Math.max(
        90,
        100 - Math.floor((uploadedLog.threatsDetected / uploadedLog.recordsProcessed) * 100)
      ),
      aiRiskScore: uploadedLog.threatsDetected > 0 ? "High" : "Low",
      lastUpdated: uploadedLog.uploadedAt,
      uptime: "99.8%",
      hasData: true
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
