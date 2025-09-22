"use client";

import { User } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface AllMembersProps {
  users: User[];
  organizationId: string;
}

export function AllMembers({ users, organizationId }: AllMembersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInviteUser = async (user: User) => {
    try {
      setIsLoading(true);
      const { error } = await authClient.organization.inviteMember({
        email: user.email,
        role: "member",
        organizationId: organizationId,
      });

      if (error) {
        toast.error("Failed to invite member to organization");
        console.log(error);
        return;
      }

      setIsLoading(false);
      toast.success("Invitation sent to member");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to invite member to organization");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">All Users</h2>
      {users.map((user) => (
        <div key={user.id}>
          <Button
            className="my-1"
            onClick={async () => await handleInviteUser(user)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Invite ${user.name} to organization`
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
