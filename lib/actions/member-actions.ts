"use server";

import { auth } from "../auth";
import { UserRole } from "../generated/prisma";
import { prisma } from "../prisma";
import { isAdmin } from "./permission";

export const addMember = async (
  userId: string,
  role: UserRole,
  organizationId: string
) => {
  try {
    await auth.api.addMember({
      body: {
        userId: userId,
        role,
        organizationId: organizationId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeMember = async (userId: string) => {
  const admin = await isAdmin();

  if (!admin) {
    return { success: false, error: "You are not authorizied to do this" };
  }
  try {
    await prisma.member.deleteMany({
      where: {
        userId,
      },
    });
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to removed member",
    };
  }
};
