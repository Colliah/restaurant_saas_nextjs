"use client";

import { removeMember } from "@/lib/actions/member-actions";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface MemberRemoveProps {
  userId: string;
}

export default function MemberRemove({ userId }: MemberRemoveProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      const { success, error } = await removeMember(userId);
      if (!success) {
        toast.error(error);
        return;
      }

      setIsLoading(false);
      toast.success("Deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(`Deleted failed ${error}`);
    }
  };
  return (
    <Button onClick={handleRemove} variant="destructive" disabled={isLoading}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Remove"}
    </Button>
  );
}
