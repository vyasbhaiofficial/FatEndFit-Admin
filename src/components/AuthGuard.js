"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../utils/loader";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = ["/login", "/forgot-password", "/admin/reset-password"];

  useEffect(() => {
    const hasLocalToken =
      typeof window !== "undefined" && localStorage.getItem("token");
    const isPublic = publicRoutes.includes(pathname || "");
    if (!loading && !isPublic && !isAuthenticated() && !hasLocalToken) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const hasLocalToken =
    typeof window !== "undefined" && localStorage.getItem("token");
  const isPublic = publicRoutes.includes(pathname || "");
  if (!isPublic && !isAuthenticated() && !hasLocalToken) {
    return null; // Will redirect to login
  }

  return children;
};

export default AuthGuard;
