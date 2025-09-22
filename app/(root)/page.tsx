import { CreateOrganizationDialog } from "@/components/organization/create-organization-dialog";
import { Button } from "@/components/ui/button";
import { getOrganizations } from "@/lib/actions/organization-actions";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const organization = await getOrganizations();

  return (
    <div>
      <CreateOrganizationDialog />
      <div>
        {organization.map((org) => (
          <Button variant="outline" key={org.id} asChild>
            <Link href={`/organization/${org.slug}`}>{org.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
