import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/auth";

/**
 * GET /api/dashboard/has-logs
 * Check if user has uploaded any logs
 */
export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Check if user has uploaded logs
    const uploadedLogs = await prisma.uploadedLog.findFirst({
      where: {
        user_id: session.user.id
      },
      orderBy: {
        uploadedAt: "desc"
      }
    });

    return NextResponse.json({
      hasLogs: !!uploadedLogs,
      lastUpload: uploadedLogs ? uploadedLogs.uploadedAt : null
    });
  } catch (error) {
    console.error("Has logs API error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
