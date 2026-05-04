import CredentialsProvider from "next-auth/providers/credentials";
import {CredentialsSignin} from "next-auth";
import {prisma} from "./prisma";
import {verifyPassword} from "./crypto";

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new InvalidCredentialsError();

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {email: credentials.email}
        });

        if (!user) throw new InvalidCredentialsError();

        if (!user.email_verified) throw new EmailNotVerifiedError();

        // Verify password
        const passwordMatch = await verifyPassword(credentials.password, user.password_hash);

        if (!passwordMatch) throw new InvalidCredentialsError();

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          email_verified: user.email_verified
        };
      }
    })
  ],

  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.email_verified = user.email_verified;
      }
      return token;
    },

    async session({session, token}) {
      session.user.id = token.id;
      session.user.email_verified = token.email_verified;
      return session;
    }
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET
};
