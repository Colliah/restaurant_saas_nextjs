import { defaultStatements } from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
  project: ["create"],
});

const admin = ac.newRole({
  project: ["create", "update"],
});

const owner = ac.newRole({
  ...Object.fromEntries(
    Object.entries(defaultStatements).map(([k, v]) => [k, [...v]])
  ),
  project: ["create", "update", "delete"],
});

export { ac, member, admin, owner, statement };
