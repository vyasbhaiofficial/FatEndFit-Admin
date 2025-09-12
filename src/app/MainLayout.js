"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../navigation/Sidebar";
import Navbar from "../navigation/Navbar";
import AuthGuard from "../components/AuthGuard";
import Loader from "@/utils/loader";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  const hideLayout = [
    "/login",
    "/register",
    "/forgot-password",
    "/admin/reset-password",
  ];
  const showLayout = !hideLayout.includes(pathname) && isAuthenticated();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // If it's a login/register page, show without layout
  if (hideLayout.includes(pathname)) {
    return children;
  }

  // For protected routes, wrap with AuthGuard
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F5F5F5]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <Navbar />
          </div>
          <main className="p-4 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
