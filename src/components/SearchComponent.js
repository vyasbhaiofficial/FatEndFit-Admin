"use client";
import React, { useState, useEffect } from "react";

const SearchComponent = ({ onSearch, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Auto search as user types with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 300); // 300ms delay for better performance

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search by name, patient ID, mobile, or branch..."
          className="w-full pl-12 pr-4 py-2 text-lg border-1 border-yellow-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 shadow-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {searchTerm && (
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Searching for: </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
            "{searchTerm}"
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
