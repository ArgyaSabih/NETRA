import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import {isValidEmail, sanitizeInput} from "@/src/lib/validators";
import {sendPasswordResetEmail} from "@/src/lib/email";
import crypto from "crypto";

function getResetTokenExpiration() {
  const now = new Date();
  return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = sanitizeInput(body?.email?.toLowerCase());

    if (!isValidEmail(email)) {
      return NextResponse.json({error: "Invalid email format"}, {status: 400});
    }

    // Prevent account enumeration: return success even if not found.
    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
      return NextResponse.json(
        {success: true, message: "If an account exists, a reset link has been sent."},
        {status: 200}
      );
    }

    // Create a one-time token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = getResetTokenExpiration();

    if (prisma.passwordResetToken?.create) {
      await prisma.passwordResetToken.create({
        data: {
          token,
          expires_at: expiresAt,
          user_id: user.id
        }
      });
    } else {
      const id = crypto.randomUUID();
      await prisma.$executeRaw`
        INSERT INTO "password_reset_tokens" ("id", "token", "expires_at", "user_id")
        VALUES (${id}, ${token}, ${expiresAt}, ${user.id})
      `;
    }

    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      await prisma.passwordResetToken.deleteMany({where: {token}});
      return NextResponse.json({error: "App URL is not configured"}, {status: 500});
    }
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    const emailResult = await sendPasswordResetEmail(email, resetLink);

    if (!emailResult.success) {
      await prisma.passwordResetToken.deleteMany({where: {token}});
      return NextResponse.json({error: "Failed to send reset email. Please try again."}, {status: 500});
    }

    return NextResponse.json(
      {success: true, message: "If an account exists, a reset link has been sent."},
      {status: 200}
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({error: "An error occurred. Please try again."}, {status: 500});
  }
}
