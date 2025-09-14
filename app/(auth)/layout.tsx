import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen justify-center items-center w-full ">
      {children}
    </div>
  );
}
