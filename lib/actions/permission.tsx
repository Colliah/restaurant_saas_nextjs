"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const isSuperAdmin = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          owner: ["manage"],
          restaurant: ["create", "update", "delete", "read"],
          project: ["create", "delete", "share", "update"],
        },
      },
    });

    if (error) {
      return { success: false, error };
    }
    return success;
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const isOwner = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ["create", "delete", "share", "update"],
          restaurant: ["create", "update", "delete", "read"],
        },
      },
    });

    if (error) {
      return { success: false, error };
    }
    return success;
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const isStaff = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ["create", "update"],
          restaurant: ["read", "update"],
        },
      },
    });

    if (error) {
      return { success: false, error };
    }
    return success;
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const isMember = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ["read"],
        },
      },
    });

    if (error) {
      return { success: false, error };
    }
    return success;
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
