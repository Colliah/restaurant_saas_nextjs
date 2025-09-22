import { Button } from "@/components/ui/button";
import { getOrganizations } from "@/lib/actions/organization-actions";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const organization = await getOrganizations();

  return (
    <div className="flex items-center gap-x-2 my-2 container mx-auto">
      List Organization:
      <div className="space-x-2">
        {organization.map((org) => (
          <Button variant="outline" key={org.id} asChild>
            <Link href={`/organization/${org.slug}`}>{org.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
