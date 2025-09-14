import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const page = async () => {
  // redirect("/sign-in");
  const res = await prisma.user.findMany();
  console.log(res);
};

export default page;
