"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

/**
 * RoleGuard restricts access to children based on user role.
 * Usage: <RoleGuard allow={["Admin"]}>{children}</RoleGuard>
 */
const RoleGuard = ({ allow = [], fallback = null, children }) => {
  const { role, loading, isAuthenticated } = useAuth();
  console.log('user role-----------------------',role)
  const router = useRouter();

  const isAllowed = allow.length === 0 || (role && allow.includes(role));

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return null;
  if (!isAuthenticated()) return null;
  if (!isAllowed) return fallback ?? null;

  return children;
};

export default RoleGuard;
