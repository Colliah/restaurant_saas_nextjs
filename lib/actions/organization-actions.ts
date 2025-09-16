"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const createOrganization = async (
  name: string,
  slug: string,
  logo: string
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

export const checkExistSlug = async () => {};
