"use client";
import React from "react";

const ThemedCheckbox = ({ checked, onChange, ariaLabel, disabled = false }) => {
  return (
    <label
      className={`inline-flex items-center select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={`w-4 h-4 rounded-md border border-yellow-400 bg-white peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-300 peer-checked:border-amber-400 shadow-sm flex items-center justify-center transition-all ${
          disabled ? "bg-gray-100 border-gray-300" : ""
        }`}
      >
        <svg
          className={`w-3 h-3 text-black opacity-${
            checked ? 100 : 0
          } transition-opacity`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.435a1 1 0 111.414-1.414l3.01 3.01 6.657-6.657a1 1 0 011.333-.081z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </label>
  );
};

export default ThemedCheckbox;
