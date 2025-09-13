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

const githubClientId = process.env.GOOGLE_CLIENT_ID!;
const githubClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleClientId = process.env.GITHUB_CLIENT_ID!;
const googleClientSecret = process.env.GITHUB_CLIENT_SECRET!;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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
  appName: "restaurant_saas_nextjs",
  plugins: [
    openAPI(),
    multiSession(),
    organization(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        // Send email with OTP
      },
    }),
    phoneNumber(),
    username(),
    nextCookies(),
  ],
});
