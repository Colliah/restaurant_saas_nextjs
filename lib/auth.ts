import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  username,
  phoneNumber,
  emailOTP,
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
import OrganizationInvitation from "@/components/email/organization-invite";
import { getActiveOrganization } from "./actions/organization-actions";
import { ac, owner, admin, member } from "./permission";

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
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        },
      },
    },
  },

  appName: "restaurant_saas_nextjs",
  plugins: [
    openAPI(),
    multiSession(),
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
      async sendInvitationEmail(data) {
        const inviteLink = `http://localhost:3000/api/accept-invitation/${data.id}`;
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: data.email,
          subject: "You've been invited to join our organization",
          react: OrganizationInvitation({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
        });
      },
    }),
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
