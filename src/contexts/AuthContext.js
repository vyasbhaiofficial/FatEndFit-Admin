"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../Api/AllApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth from localStorage immediately
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUserRaw = localStorage.getItem("user");
        if (storedToken) {
          // Trust token immediately so UI stays on protected pages after refresh
          setToken(storedToken);
          try {
            const parsedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
            setUser(parsedUser);
          } catch {
            setUser(null);
          }
          // Optional: try to validate in background without forcing logout on failure
          // try {
          //   await validateToken();
          // } catch (e) {
          //   // Swallow validation errors here to avoid redirect loops on refresh
          // }
        } else {
          // No token present
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth init failed:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const login = async (email, password) => {
    try {
      const data = await loginAdmin(email, password);
      const authToken = data.token;
      const admin = data.admin;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(admin));
      setToken(authToken);
      setUser(admin);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  // Normalize role and branches for consistent checks in UI
  const normalizeRole = (adminType) => {
    if (!adminType) return null;
    const key = String(adminType).toLowerCase().replace(/\s+/g, "");
    if (key === "admin") return "Admin";
    if (key === "subadmin") return "subadmin";
    return adminType; // fallback to raw value
  };

  const normalizeBranchIds = (branchArr) => {
    if (!Array.isArray(branchArr)) return [];
    return branchArr
      .map((b) => (typeof b === "string" ? b : b?._id))
      .filter(Boolean);
  };

  const value = {
    user,
    role: normalizeRole(user?.adminType),
    branches: normalizeBranchIds(user?.branch),
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
