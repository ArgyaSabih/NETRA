# Authentication System Setup Guide

## Overview

This guide walks you through setting up the authentication system for NETRA with email verification using Resend and Supabase Postgres.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for Postgres database)
- Resend account (for email verification)

## Installation Steps

### 1. Install Dependencies

Dependencies have already been installed via npm:

- `next-auth@beta` - Authentication library
- `@prisma/client` - Database ORM
- `prisma` - Database migrations
- `bcryptjs` - Password hashing

If you need to reinstall, run:

```bash
npm install next-auth@beta @prisma/client prisma bcryptjs
```

### 2. Environment Variables Setup

#### Get Your Resend API Key

1. Go to [Resend Dashboard](https://dashboard.resend.com)
2. Copy your API key
3. It should already be in your `.env` file as `RESEND_API_KEY`

#### Setup Supabase Postgres Database

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Use the default Postgres database
4. Go to Database > Connection String
5. Copy the URI connection string

#### Generate NextAuth Secret

Run this command in your terminal:

```bash
openssl rand -base64 32
```

This will generate a random secret key for NextAuth.

#### Update .env file

Update `d:\Kuliah\Semester 6\Senior Project\NETRA\netra\.env`:

```
RESEND_API_KEY = "your_api_key"
RESEND_FROM_EMAIL = "onboarding@resend.dev"

# Supabase Postgres Connection String
DATABASE_URL = "postgresql://user:password@host:port/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET = "your-generated-secret-key"
NEXTAUTH_URL = "http://localhost:3000"
```

### 3. Prisma Database Setup

#### Push Schema to Database

This will create the tables defined in `db/schema.prisma`:

```bash
npx prisma db push
```

#### Generate Prisma Client

```bash
npx prisma generate
```

#### (Optional) View Database with Prisma Studio

```bash
npx prisma studio
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js       # NextAuth handler
│   │   ├── auth-signup/route.js              # Sign up endpoint
│   │   └── verify-email/route.js             # Email verification endpoint
│   └── auth/
│       ├── layout.js                          # Auth layout
│       ├── login/page.js                      # Login page
│       ├── sign-up/page.js                    # Sign up page
│       └── verify-pending/page.js             # Verification pending page
├── components/
│   └── auth/
│       ├── AuthLayout.js                      # Auth layout component
│       ├── AuthSessionProvider.js             # NextAuth session provider
│       ├── LoginForm.js                       # Login form
│       └── SignUpForm.js                      # Sign up form
├── lib/
│   ├── auth-config.js                         # NextAuth configuration
│   ├── crypto.js                              # Password hashing utilities
│   ├── email.js                               # Email service with Resend
│   ├── prisma.js                              # Prisma client
│   └── validators.js                          # Input validation
└── db/
    └── schema.prisma                           # Prisma schema
```

## Authentication Flow

### Sign Up Flow

1. User fills form (Name, Email, Password)
2. Form validates input
3. POST to `/api/auth-signup`
4. Backend:
   - Validates inputs
   - Checks if email exists
   - Creates unverified user in database
   - Generates verification token
   - Sends verification email via Resend
5. User sees "Check Your Email" page
6. User clicks link in email
7. Link redirects to `/api/verify-email?token=...&email=...`
8. Backend:
   - Verifies token and expiration
   - Marks user as verified
   - Deletes verification token
   - Redirects to login with success message
9. User can now log in

### Login Flow

1. User enters Email and Password
2. Form validates input
3. NextAuth `signIn()` with credentials provider
4. Backend:
   - Finds user by email
   - Checks if email is verified
   - Compares password hash
   - Creates session/JWT token
5. User is redirected to dashboard
6. Session persists on page refresh

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  name VARCHAR(191) NOT NULL,
  password_hash VARCHAR(191) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Verification Tokens Table

```sql
CREATE TABLE verification_tokens (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) NOT NULL,
  token VARCHAR(191) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(191),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Testing the System

### 1. Test Sign Up

1. Go to `http://localhost:3000/auth/sign-up`
2. Fill in: Name, Email, Password
3. Click "Sign Up"
4. Should see "Check Your Email" message
5. Check your email for verification link
6. Click the link
7. Should be redirected to login with success message

### 2. Test Email Verification

1. Check your email inbox (or spam)
2. Click the verification link
3. Should be automatically redirected to login page
4. Should see "Email verified!" message

### 3. Test Login

1. Go to `http://localhost:3000/auth/login`
2. Enter email and password
3. Click "Login"
4. Should be redirected to `/dashboard`
5. Navbar should show "Dashboard" and "Logout" instead of "Sign Up" and "Login"

### 4. Test Session Persistence

1. After logging in, refresh the page
2. Session should persist (you should still be logged in)
3. Check browser DevTools > Application > Cookies for session/JWT

## Troubleshooting

### Database Connection Error

- Check `DATABASE_URL` in `.env`
- Ensure Supabase MySQL is enabled
- Test connection with `npx prisma db push`

### Email Not Being Sent

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for failed emails
- Ensure `RESEND_FROM_EMAIL` is set

### NextAuth Secret Error

- Generate new secret: `openssl rand -base64 32`
- Update `NEXTAUTH_SECRET` in `.env`

### Login Not Working

- Check if user is verified in database
- Use Prisma Studio: `npx prisma studio`
- Check password hash is correct

## Next Steps

1. **Create Dashboard Page**: Create `/app/dashboard/page.js` for authenticated users
2. **Add Password Reset**: Implement forgot password functionality
3. **Add User Profile**: Create profile management page
4. **Add OAuth Providers**: Add Google/GitHub login options
5. **Add Two-Factor Auth**: Implement 2FA for additional security

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- Verification tokens expire after 24 hours
- NEXTAUTH_SECRET should be different for production
- Use HTTPS in production
- Set `NEXTAUTH_URL` to your production domain in production

## Support

For issues with:

- **NextAuth**: https://next-auth.js.org
- **Prisma**: https://www.prisma.io/docs
- **Resend**: https://resend.com/docs
- **Supabase**: https://supabase.com/docs
