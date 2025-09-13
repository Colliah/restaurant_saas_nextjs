"use client";
import { signOut } from "@/lib/actions/auth-actions";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Session = typeof auth.$Infer.Session;

export default function DashboardClientPage({ session }: { session: Session }) {
  const router = useRouter();
  const user = session.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full"
            src={
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            }
          />
          <div className="text-sm">
            <p className="text-gray-900 font-medium">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
