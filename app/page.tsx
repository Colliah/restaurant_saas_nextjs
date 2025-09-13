import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const page = async () => {
  // redirect("/auth");
  const res = await prisma.user.findMany();
  console.log(res);
};

export default page;
