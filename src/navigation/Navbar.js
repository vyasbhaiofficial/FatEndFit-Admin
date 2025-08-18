"use client";

import { useState, useRef, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ import useRouter

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter(); // ✅ initialize router

  // close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout handler
  const handleLogout = () => {
    // ✅ Clear any auth tokens if needed
    localStorage.removeItem("token"); // example, aapke token key ke hisaab se
    router.push("/login"); // ✅ redirect to login page
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 shadow-md sticky top-0 z-30 border-b border-gray-100">
      {/* Brand / Title */}
      <h2 className="text-xl font-bold text-gray-800 tracking-wide relative group">
        Dashboard
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
      </h2>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700 shadow-sm"
        >
          <MdAccountCircle size={28} />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <MdAccountCircle size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="py-1">
              <li>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout} // ✅ call logout handler
                  className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
