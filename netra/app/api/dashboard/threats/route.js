import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {prisma} from "@/src/lib/prisma";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Check if user has uploaded any logs
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/threats`, {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session?.user?.id,
      },
    });
    
    const uploadedLog = await response.json();

    // If no logs, return empty threats
    if (!uploadedLog) {
      return NextResponse.json({
        threats: [],
        totalThreatsDetected: 0,
        lastUpdated: new Date(),
        hasData: false
      });
    }

    // Calculate threat distribution based on uploaded logs
    const totalThreats = uploadedLog[0].threatsDetected;
    const threats = [
      {
        name: "DDoS Attacks",
        percentage: 45,
        color: "bg-red-500",
        count: Math.floor(totalThreats * 0.45)
      },
      {
        name: "Bruteforce",
        percentage: 28,
        color: "bg-orange-500",
        count: Math.floor(totalThreats * 0.28)
      },
      {
        name: "Malware",
        percentage: 15,
        color: "bg-purple-500",
        count: Math.floor(totalThreats * 0.15)
      },
      {
        name: "Phishing",
        percentage: 12,
        color: "bg-blue-500",
        count: Math.floor(totalThreats * 0.12)
      }
    ];

    return NextResponse.json({
      threats,
      totalThreatsDetected: totalThreats,
      lastUpdated: uploadedLog[0].uploadedAt,
      hasData: true
    });
  } catch (error) {
    console.error("Threats API error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
