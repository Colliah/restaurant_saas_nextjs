"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrganizationProps {
  organizations: Organization[];
}

export function OrganizationSwitcher({ organizations }: OrganizationProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();

  const handleChangeOrganization = async (organizationId: string) => {
    try {
      await authClient.organization.setActive({
        organizationId,
      });

      const org = organizations.find((o) => o.id === organizationId);
      if (org?.slug) {
        router.push(`/organization/${org.slug}`);
      } else {
        router.push(`/organization/${organizationId}`);
      }

      toast.success("Organization switched successfully");
    } catch (error) {
      toast.error(`Failed to switch organization: ${error}`);
    }
  };

  return (
    <Select
      onValueChange={handleChangeOrganization}
      value={activeOrganization?.id}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
