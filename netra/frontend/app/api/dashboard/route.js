import {NextResponse} from "next/server";
import {auth} from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session?.user?.id,
      },
    });

    if (!response.ok) throw new Error("Backend error");

    const data = await response.json();  // BE sudah return object, bukan array
    return NextResponse.json(data);

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
