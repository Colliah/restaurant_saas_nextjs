"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const isAdmin = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ["create", "delete", "share", "update", "read"],
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error,
      };
    }
    return success;
  } catch (error) {
    console.log(error);
  }
};
