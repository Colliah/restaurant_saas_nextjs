"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getUsers } from "@/lib/actions/organization-actions";

export type User = Awaited<ReturnType<typeof getUsers>>[number];

interface AllMembersProps {
  users: User[];
  organizationId: string;
}

export function AllMembers({ users, organizationId }: AllMembersProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const router = useRouter();

  const handleInviteUser = async (user: User) => {
    setLoadingUserId(user.id);
    try {
      const { error } = await authClient.organization.inviteMember({
        email: user.email,
        role: "member",
        organizationId: organizationId,
      });

      if (error) {
        toast.error("Failed to invite member to organization");
        console.error(error);
        return;
      }

      toast.success(`Invitation sent to ${user.name}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">All Users</h2>
      {users.map((user) => (
        <div key={user.id}>
          <Button
            className="my-1"
            onClick={() => handleInviteUser(user)}
            disabled={loadingUserId !== null}
          >
            {loadingUserId === user.id ? (
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
