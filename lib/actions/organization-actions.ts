"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { getCurrentUser } from "./auth-actions";
import { prisma } from "../prisma";

export async function getOrganizations() {
  const { currentUser } = await getCurrentUser();

  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: { userId: currentUser.id },
      },
    },
  });

  return organizations;
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await prisma.member.findFirst({
    where: {
      userId: userId,
    },
  });
  const activeOrganization = await prisma.organization.findFirst({
    where: {
      id: memberUser?.organizationId,
    },
  });
  return activeOrganization;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const organizationBySlug = await prisma.organization.findFirst({
      where: {
        slug: slug,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return organizationBySlug;
  } catch (error) {
    console.log(`${error}`);
    return null;
  }
}

export const createOrganization = async (
  name: string,
  slug: string,
  logo: string,
  keepCurrentActiveOrganization: boolean
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const data = await auth.api.createOrganization({
    body: {
      name: name,
      slug: slug,
      logo: logo,
      userId: session?.user.id,
      keepCurrentActiveOrganization: false,
    },
    headers: await headers(),
  });
  return data;
};

export const getUsers = async (organizationId: string) => {
  try {
    const member = await prisma.member.findMany({
      where: {
        organizationId: organizationId,
      },
    });
    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: member.map((m) => m.userId),
        },
      },
    });
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
};
