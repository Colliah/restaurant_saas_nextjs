import Navigation from "@/components/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function RootLayout({ children }: Props) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
