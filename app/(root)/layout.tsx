import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function RootLayout({ children }: Props) {
  return (
    <div>
      <Navigation />
      {children}
      <Toaster richColors />
    </div>
  );
}
