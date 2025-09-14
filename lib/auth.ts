import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  username,
  phoneNumber,
  emailOTP,
  admin,
  organization,
  multiSession,
  openAPI,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import EmailVerification from "@/components/email/email-verification";
import { resend } from "./resend";
import VerifyOTP from "@/components/email/verify-otp";

const githubClientId = process.env.GITHUB_CLIENT_ID!;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET!;
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email",
        react: EmailVerification({
          userName: user.name ?? "User",
          verificationUrl: url,
        }),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 300,
  },

  appName: "restaurant_saas_nextjs",
  plugins: [
    openAPI(),
    multiSession(),
    organization(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: email,
          subject: "OTP verify",
          react: VerifyOTP({
            otp: otp,
            type: "forgot-password",
          }),
        });
      },
    }),
    phoneNumber(),
    username(),
    nextCookies(),
  ],
});
