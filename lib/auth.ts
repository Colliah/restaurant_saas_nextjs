import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { nextCookies } from "better-auth/next-js";

const githubClientId = process.env.GOOGLE_CLIENT_ID!;
const githubClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleClientId = process.env.GITHUB_CLIENT_ID!;
const googleClientSecret = process.env.GITHUB_CLIENT_SECRET!;

const prisma = new PrismaClient();
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
  plugins: [nextCookies()],
});
