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
import { prisma } from "./lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
