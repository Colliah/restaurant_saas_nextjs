"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return { success: true, user: result.user };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, user: result.user };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const signInSocial = async (provider: "github" | "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};

export const forgotPassword = async (email: string) => {
  const result = await auth.api.forgetPasswordEmailOTP({
    body: {
      email: email,
    },
  });
  return result;
};

export const checkVerifyForgotPassword = async (email: string, otp: string) => {
  const result = await auth.api.checkVerificationOTP({
    body: {
      email: email,
      type: "forget-password",
      otp: otp,
    },
  });
  return result;
};

export const resetPassword = async (
  email: string,
  otp: string,
  password: string
) => {
  const result = await auth.api.resetPasswordEmailOTP({
    body: {
      email: email,
      otp: otp,
      password,
    },
  });
  return result;
};

export const handleEmailOTP = async (email: string) => {
  const result = await auth.api.sendVerificationOTP({
    body: {
      email: email,
      type: "sign-in",
    },
  });
  return result;
};

export const checkOTP = async (email: string, otp: string) => {
  try {
    const result = await auth.api.checkVerificationOTP({
      body: {
        email,
        otp,
        type: "sign-in",
      },
    });

    return { success: true, user: result.success };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "OTP verification failed",
    };
  }
};

export const signInWithOTP = async (email: string, otp: string) => {
  try {
    const result = await auth.api.signInEmailOTP({
      body: {
        email,
        otp,
      },
    });

    return { success: true, user: result.user };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "OTP sign-in failed",
    };
  }
};
