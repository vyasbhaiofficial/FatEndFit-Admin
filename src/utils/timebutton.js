"use client";
import React from "react";

export default function TimeButton({
  loading = false,
  onClick = () => {},
  disabled = false,
  className = "",
  children,
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors disabled:opacity-60 ${
        loading ? "bg-yellow-500 hover:bg-yellow-500" : "bg-yellow-500 hover:bg-yellow-600"
      } text-white ${className}`}
    >
      {loading && (
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      <span>{loading ? "Creating..." : children}</span>
    </button>
  );
}