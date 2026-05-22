import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import {sanitizeInput, validatePassword} from "@/src/lib/validators";
import {hashPassword} from "@/src/lib/crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = sanitizeInput(body?.token);
    const password = body?.password;

    if (!token) {
      return NextResponse.json({error: "Invalid or expired reset link"}, {status: 400});
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({error: passwordValidation.errors.join(", ")}, {status: 400});
    }

    const resetToken = prisma.passwordResetToken?.findUnique
      ? await prisma.passwordResetToken.findUnique({where: {token}})
      : await prisma.$queryRaw`
          SELECT "token", "expires_at", "user_id"
          FROM "password_reset_tokens"
          WHERE "token" = ${token}
          LIMIT 1
        `.then((rows) => rows?.[0]);

    if (!resetToken) {
      return NextResponse.json({error: "Invalid or expired reset link"}, {status: 400});
    }

    if (new Date() > resetToken.expires_at) {
      if (prisma.passwordResetToken?.deleteMany) {
        await prisma.passwordResetToken.deleteMany({where: {token}});
      } else {
        await prisma.$executeRaw`DELETE FROM "password_reset_tokens" WHERE "token" = ${token}`;
      }
      return NextResponse.json({error: "Reset link has expired"}, {status: 400});
    }

    const newHash = await hashPassword(password);

    await prisma.user.update({
      where: {id: resetToken.user_id},
      data: {password_hash: newHash}
    });

    // Invalidate all reset tokens for this user
    if (prisma.passwordResetToken?.deleteMany) {
      await prisma.passwordResetToken.deleteMany({where: {user_id: resetToken.user_id}});
    } else {
      await prisma.$executeRaw`DELETE FROM "password_reset_tokens" WHERE "user_id" = ${resetToken.user_id}`;
    }

    return NextResponse.json({success: true, message: "Password updated successfully"}, {status: 200});
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({error: "An error occurred. Please try again."}, {status: 500});
  }
}
