"use server";

import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification email to user
 * @param {string} email - User email
 * @param {string} token - Verification token
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendVerificationEmail(email, token) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return {
      success: false,
      message: "Email service is not configured"
    };
  }

  if (!process.env.NEXTAUTH_URL) {
    console.error("NEXTAUTH_URL is not set");
    return {
      success: false,
      message: "App URL is not configured"
    };
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const {data, error} = await resend.emails.send({
      from,
      to: email,
      subject: "Verify your NETRA account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9fafb;
              }
              .card {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                text-align: center;
              }
              .header {
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #1f2937;
              }
              h1 {
                color: #1f2937;
                margin: 20px 0;
                font-size: 24px;
              }
              p {
                color: #6b7280;
                margin: 15px 0;
              }
              .button {
                display: inline-block;
                margin: 30px 0;
                padding: 12px 30px;
                background-color: #374151;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
              }
              .button:hover {
                background-color: #1f2937;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #9ca3af;
              }
              .warning {
                background-color: #fef3c7;
                border: 1px solid #fcd34d;
                border-radius: 5px;
                padding: 10px;
                margin: 20px 0;
                font-size: 12px;
                color: #92400e;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="header">
                  <div class="logo">NETRA</div>
                </div>

                <h1>Verify Your Email</h1>
                <p>Welcome to NETRA! To complete your registration, please verify your email address by clicking the button below.</p>

                <a
                  href="${verificationUrl}"
                  class="button"
                  style="display:inline-block;margin:30px 0;padding:12px 30px;background-color:#374151;color:#ffffff !important;text-decoration:none;border-radius:5px;font-weight:600;"
                >
                  Verify Email
                </a>

                <p style="font-size: 14px;">Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; font-size: 12px; color: #374151;">
                  <a href="${verificationUrl}" style="color:#374151;text-decoration:underline;">${verificationUrl}</a>
                </p>

                <div class="warning">
                  This link will expire in 24 hours. If you didn't sign up for NETRA, please ignore this email.
                </div>

                <div class="footer">
                  <p>© 2026 NETRA. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error("Failed to send verification email via Resend", {
        to: email,
        from,
        error
      });
      return {
        success: false,
        message: "Failed to send verification email"
      };
    }

    if (!data?.id) {
      console.error("Resend did not return an email id", {to: email, from, data});
      return {
        success: false,
        message: "Failed to send verification email"
      };
    }

    console.log("Resend verification email queued", {to: email, from, id: data.id});

    return {
      success: true,
      message: "Verification email sent successfully"
    };
  } catch (error) {
    console.error("Failed to send verification email (exception):", {
      to: email,
      from,
      error
    });
    return {
      success: false,
      message: "Failed to send verification email"
    };
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetLink - Password reset link
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendPasswordResetEmail(email, resetLink) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return {
      success: false,
      message: "Email service is not configured"
    };
  }

  if (!process.env.NEXTAUTH_URL) {
    console.error("NEXTAUTH_URL is not set");
    return {
      success: false,
      message: "App URL is not configured"
    };
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const {data, error} = await resend.emails.send({
      from,
      to: email,
      subject: "Reset your NETRA password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .card { background-color: #ffffff; border-radius: 8px; padding: 40px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Reset Your Password</h1>
                <p>Click the link below to reset your NETRA password.</p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #374151; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
                <p style="font-size: 12px; color: #9ca3af;">This link will expire in 1 hour.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error("Failed to send password reset email via Resend", {
        to: email,
        from,
        error
      });
      return {
        success: false,
        message: "Failed to send password reset email"
      };
    }

    if (!data?.id) {
      console.error("Resend did not return an email id", {to: email, from, data});
      return {
        success: false,
        message: "Failed to send password reset email"
      };
    }

    console.log("Resend password reset email queued", {to: email, from, id: data.id});

    return {
      success: true,
      message: "Password reset email sent successfully"
    };
  } catch (error) {
    console.error("Failed to send password reset email (exception):", {
      to: email,
      from,
      error
    });
    return {
      success: false,
      message: "Failed to send password reset email"
    };
  }
}
