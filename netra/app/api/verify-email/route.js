import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        { error: "Verification token is missing" },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return Response.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires_at) {
      return Response.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Check if email is already verified
    const user = await prisma.user.findUnique({
      where: { id: verificationToken.user_id }
    });

    if (user?.email_verified) {
      return Response.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Update user - mark email as verified
    await prisma.user.update({
      where: { id: verificationToken.user_id },
      data: { email_verified: true }
    });

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    // Redirect to login with verified flag
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/auth/login?verified=true`,
      302
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json(
      { error: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
