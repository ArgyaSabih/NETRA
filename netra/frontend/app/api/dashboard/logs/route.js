import {NextResponse} from "next/server";
import {auth} from "@/auth";

// Simulate log data storage
const mockLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    severity: "CRITICAL",
    sourceIp: "192.168.1.185",
    eventType: "SQL Injection",
    message: "Attempted 'OR'1=1 on /login",
    action: "INVESTIGATE",
    statusColor: "bg-red-500/10 border-red-500/30",
    severityColor: "bg-red-500 text-white"
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    severity: "HIGH",
    sourceIp: "45.23.11.98",
    eventType: "Port Scan",
    message: "Multiple ports probed sequentially",
    action: "INVESTIGATE",
    statusColor: "bg-orange-500/10 border-orange-500/30",
    severityColor: "bg-orange-500 text-white"
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    severity: "INFO",
    sourceIp: "10.0.0.52",
    eventType: "User Login",
    message: "Successful login for user 'joee'",
    action: "Details",
    statusColor: "bg-blue-500/10 border-blue-500/30",
    severityColor: "bg-blue-500 text-white"
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    severity: "NOTICE",
    sourceIp: "System",
    eventType: "Update",
    message: "Virus definition database updated",
    action: "Details",
    statusColor: "bg-slate-500/10 border-slate-500/30",
    severityColor: "bg-slate-500 text-white"
  }
];

export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {searchParams} = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Return mock logs with pagination
    const logs = mockLogs.slice(offset, offset + limit);

    return NextResponse.json({
      logs,
      total: mockLogs.length,
      limit,
      offset
    });
  } catch (error) {
    console.error("Logs API error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function POST(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {severity, eventType, sourceIp, message} = await req.json();

    const newLog = {
      id: mockLogs.length + 1,
      timestamp: new Date().toISOString(),
      severity,
      sourceIp,
      eventType,
      message,
      action: severity === "CRITICAL" || severity === "HIGH" ? "INVESTIGATE" : "Details",
      statusColor: "bg-blue-500/10 border-blue-500/30",
      severityColor: "bg-blue-500 text-white"
    };

    mockLogs.unshift(newLog);

    return NextResponse.json(newLog, {status: 201});
  } catch (error) {
    console.error("Create log error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
