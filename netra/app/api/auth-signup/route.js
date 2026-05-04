import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import {hashPassword, generateVerificationToken, getTokenExpiration} from "@/src/lib/crypto";
import {isValidEmail, validatePassword, isValidName, sanitizeInput} from "@/src/lib/validators";
import {sendVerificationEmail} from "@/src/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const {name, email, password} = body;

    // Validate inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email?.toLowerCase());

    if (!isValidName(sanitizedName)) {
      return NextResponse.json({error: "Name must be between 2 and 100 characters"}, {status: 400});
    }

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({error: "Invalid email format"}, {status: 400});
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({error: passwordValidation.errors.join(", ")}, {status: 400});
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {email: sanitizedEmail}
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Email already registered. Please log in or verify your email if you haven't verified it yet."
        },
        {status: 409}
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = getTokenExpiration();

    // Create user with unverified email
    // Store hashed password at this point
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        name: sanitizedName,
        password_hash: hashedPassword,
        email_verified: false
      }
    });

    // Store verification token linked to user
    await prisma.verificationToken.create({
      data: {
        email: sanitizedEmail,
        token,
        expires_at: expiresAt,
        user_id: newUser.id
      }
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(sanitizedEmail, token);

    if (!emailResult.success) {
      // Clean up token if email fails
      await prisma.verificationToken.deleteMany({
        where: {email: sanitizedEmail, token}
      });
      return NextResponse.json(
        {error: "Failed to send verification email. Please try again."},
        {status: 500}
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent. Please check your email to confirm."
      },
      {status: 200}
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json({error: "An error occurred during sign up. Please try again."}, {status: 500});
  }
}
