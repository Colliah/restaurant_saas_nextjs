import { defaultStatements } from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete", "read"],
  restaurant: ["create", "update", "delete", "read"],
  owner: ["manage"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
  project: ["read"],
});

const staff = ac.newRole({
  project: ["create", "update"],
  restaurant: ["read", "update"],
});

const owner = ac.newRole({
  ...Object.fromEntries(
    Object.entries(defaultStatements).map(([k, v]) => [k, [...v]])
  ),
  project: ["create", "update", "delete", "share"],
  restaurant: ["create", "update", "delete", "read"],
});

function fullAccess<T extends Record<string, readonly string[]>>(
  st: T
): {
  [K in keyof T]: T[K][number][];
} {
  return Object.fromEntries(
    Object.entries(st).map(([k, v]) => [k, [...v]])
  ) as { [K in keyof T]: T[K][number][] };
}

const superadmin = ac.newRole(fullAccess(statement));

export { ac, member, staff, owner, superadmin, statement };
