import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member, User } from "@prisma/client";
import MemberRemove from "./member-remove";

type MemberWithUser = Member & { user: User };

interface MemberProps {
  members: MemberWithUser[];
}

export default function MemberTable({ members }: MemberProps) {
  return (
    <Table>
      <TableCaption>A list of members in organization.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((mem) => (
          <TableRow key={mem.id}>
            <TableCell>{mem.user.name}</TableCell>
            <TableCell>{mem.user.email}</TableCell>
            <TableCell>{mem.user.role}</TableCell>
            <TableCell className="text-right">
              <MemberRemove userId={mem.user.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
