import { redirect } from "next/navigation";

const page = () => {
  redirect("/auth");
};

export default page;
