"use client";
import { useState, useRef, useEffect } from "react";

const Dropdown = ({ label, options, value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block mb-1 font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        className={`w-full border border-yellow-400 rounded-xl p-3 flex justify-between items-center bg-white focus-within:ring-2 focus-within:ring-yellow-400 transition ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100"
            : "cursor-pointer"
        }`}
      >
        <span className={`${value ? "text-gray-900" : "text-gray-400"}`}>
          {selected ? selected.label : `Select ${label || "Option"}`}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && !disabled && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-yellow-400 rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="p-3 hover:bg-yellow-100 cursor-pointer transition flex items-center justify-between"
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <svg
                  className="w-4 h-4 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
