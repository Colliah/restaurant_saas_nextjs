"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Users</h1>
      {users.length === 0 ? (
        <p>No users</p>
      ) : (
        <ul className="list-disc pl-5">
          {users.map((u) => (
            <li key={u.id}>
              {u.name} <span className="text-gray-500">({u.email})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
