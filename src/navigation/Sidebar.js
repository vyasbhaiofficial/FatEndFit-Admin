"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdPeople } from "react-icons/md";

const Sidebar = () => {
  const pathname = usePathname();

  const linkClasses = (path) =>
    `flex items-center gap-3 py-3 px-5 rounded-lg font-medium transition ${
      pathname === path
        ? "bg-yellow-400 text-black shadow"
        : "text-gray-600 hover:bg-yellow-100 hover:text-black"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col h-full">
      <h1 className="text-2xl font-extrabold p-6 text-gray-900 tracking-wide">
        <span className="text-yellow-400">Fat</span>
        <span className="text-black">Endfit</span>
      </h1>
      <nav className="flex flex-col gap-2 px-3">
        <Link href="/dashboard" className={linkClasses("/dashboard")}>
          <MdDashboard size={22} /> Dashboard
        </Link>
        <Link href="/users" className={linkClasses("/users")}>
          <MdPeople size={22} /> Users
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
