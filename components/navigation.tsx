

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";


export default async function Navigation() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <nav className="flex items-center space-x-6">
            {session && (
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {!session && (
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
