import { AllMembers } from "@/components/organization/all-users";
import MemberTable from "@/components/organization/members-table";
import {
  getOrganizationBySlug,
  getUsers,
} from "@/lib/actions/organization-actions";

type Params = Promise<{ slug: string }>;

export default async function OrganizationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);
  const users = await getUsers(organization?.id || "");

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold">Organization: {organization?.name}</h1>
      <MemberTable members={organization?.members || []} />
      <AllMembers users={users} organizationId={organization?.id || ""} />
    </div>
  );
}
