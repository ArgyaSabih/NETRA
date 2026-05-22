import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {prisma} from "@/src/lib/prisma";

/**
 * POST /api/upload-log
 * Proxy file upload to backend, which handles AI Service communication and database storage.
 */
export async function POST(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {error: "No file provided", message: "Please select a file to upload"},
        {status: 400}
      );
    }

    // Validate file size (max 50MB)
    const maxFileSize = 50 * 1024 * 1024;
    if (file.size > maxFileSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `File size (${sizeMB}MB) exceeds 50MB limit`;
      return NextResponse.json({error: msg, message: msg}, {status: 400});
    }

    // Validate file type
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const validExtensions = [".csv", ".log", ".test"];
    if (!validExtensions.includes(fileExtension)) {
      const msg = `File type ${fileExtension} is not supported. Only .csv, .log, and .test files are allowed.`;
      return NextResponse.json({error: msg, message: msg}, {status: 400});
    }

    // Forward to backend
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    console.log(`[Upload] Forwarding ${file.name} to backend...`);
    const backendResponse = await fetch(`${BACKEND_URL}/api/upload-log`, {
      method: "POST",
      headers: {
        "x-user-id": session.user.id
      },
      body: backendFormData
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error("[Upload] Backend error:", backendResponse.status, errorData);
      return NextResponse.json(
        errorData || {error: "Backend processing failed"},
        {status: backendResponse.status}
      );
    }

    const result = await backendResponse.json();
    console.log(`[Upload] Backend processing complete for ${file.name}`);
    return NextResponse.json(result, {status: 200});
  } catch (error) {
    console.error("[Upload] Unexpected error:", error.message, error.stack);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        message: error.message || "An unexpected error occurred during upload",
        details: process.env.NODE_ENV === "development" ? error.toString() : undefined
      },
      {status: 500}
    );
  }
}

/**
 * GET /api/upload-log
 * Get upload history for the authenticated user
 */
export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const uploads = await prisma.uploadedLog.findMany({
      where: {user_id: session.user.id},
      orderBy: {uploadedAt: "desc"}
    });

    return NextResponse.json({uploads});
  } catch (error) {
    console.error("Get uploads error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
