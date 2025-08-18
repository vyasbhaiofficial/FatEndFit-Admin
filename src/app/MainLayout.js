"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../navigation/Sidebar";
import Navbar from "../navigation/Navbar";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  const hideLayout = ["/login", "/register"];
  const showLayout = !hideLayout.includes(pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      {showLayout && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {showLayout && <Navbar />}
        <main className="p-4 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
