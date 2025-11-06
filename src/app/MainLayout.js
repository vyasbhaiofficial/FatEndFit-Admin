"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../navigation/Sidebar";
import Navbar from "../navigation/Navbar";
import AuthGuard from "../components/AuthGuard";
import Loader from "@/utils/loader";
import { trackPanelOpen, trackPanelClose, API_BASE } from "@/Api/AllApi";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  // Track panel open/close with refresh detection
  useEffect(() => {
    if (isAuthenticated() && !loading) {
      // Check if page was already loaded in this session
      const pageLoaded = sessionStorage.getItem("pageLoaded");

      // If page not loaded before, it's a new session (not refresh)
      if (!pageLoaded) {
        // Track panel open for new session
        trackPanelOpen().catch((err) => {
          console.error("Failed to track panel open:", err);
        });
        // Mark page as loaded
        sessionStorage.setItem("pageLoaded", "true");
      }

      // Detect refresh: when user presses F5, Ctrl+R, or refresh button
      const handleKeyDown = (e) => {
        if (e.key === "F5" || (e.ctrlKey && (e.key === "r" || e.key === "R"))) {
          sessionStorage.setItem("isRefreshing", "true");
        }
      };

      // Detect refresh via navigation timing (modern API)
      const handlePageshow = (e) => {
        if (e.persisted) {
          // Page loaded from cache (back/forward navigation) - not a refresh
          sessionStorage.setItem("isRefreshing", "false");
        } else {
          // Check if it's a reload using Navigation Timing API
          const navType = performance.getEntriesByType("navigation")[0]?.type;
          if (navType === "reload") {
            sessionStorage.setItem("isRefreshing", "true");
            // Don't track open on refresh
            sessionStorage.setItem("pageLoaded", "true");
          }
        }
      };

      // Track panel close only when browser/tab is completely closed (not refresh)
      const handleBeforeUnload = () => {
        const isRefreshing = sessionStorage.getItem("isRefreshing") === "true";

        // Only track close if it's NOT a refresh
        if (!isRefreshing) {
          // Use synchronous XMLHttpRequest for beforeunload
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${API_BASE}/admin/logs/panel/close`, false);
          const token = localStorage.getItem("token");
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
          xhr.setRequestHeader("Content-Type", "application/json");
          try {
            xhr.send(JSON.stringify({}));
          } catch (err) {
            // Ignore errors during unload
          }
        } else {
          // It's a refresh, reset flags for next load
          sessionStorage.removeItem("isRefreshing");
          // Keep pageLoaded so we know it's a refresh on next load
        }
      };

      // Initialize refresh detection
      if (typeof window !== "undefined") {
        const navType = performance.getEntriesByType("navigation")[0]?.type;
        if (navType === "reload") {
          sessionStorage.setItem("isRefreshing", "true");
          sessionStorage.setItem("pageLoaded", "true");
        }
      }

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("pageshow", handlePageshow);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("pageshow", handlePageshow);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isAuthenticated, loading]);

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
      <div className="flex min-h-screen bg-[#F5F5F5]">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: "256px" }}>
          <div className="p-4">
            <Navbar />
          </div>
          <main className="p-4 flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
