import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";

export async function GET(request) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const origin = request.nextUrl.origin;

    const redirectToLogin = (params) => NextResponse.redirect(`${origin}/auth/login${params}`);

    if (!token) {
      return redirectToLogin(`?error=${encodeURIComponent("Invalid verification link")}`);
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {token}
    });

    if (!verificationToken) {
      return redirectToLogin(`?error=${encodeURIComponent("Invalid or expired verification link")}`);
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires_at) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {token}
      });
      return redirectToLogin(`?error=${encodeURIComponent("Verification link has expired")}`);
    }

    const email = verificationToken.email;

    // Mark user email as verified
    await prisma.user.update({
      where: {email},
      data: {email_verified: true}
    });

    // Delete verification token
    await prisma.verificationToken.delete({
      where: {token}
    });

    // Redirect to login page with success message
    return redirectToLogin("?verified=true");
  } catch (error) {
    console.error("Email verification error:", error);
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent("An error occurred during verification")}`
    );
  }
}
