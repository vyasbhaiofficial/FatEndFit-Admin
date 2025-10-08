// components/ui/ActionButton.jsx
"use client";

import { FiEdit, FiTrash2, FiClock } from "react-icons/fi";

export const ActionButton = ({ type = "edit", onClick, disabled = false }) => {
  const isEdit = type === "edit";
  const isDelete = type === "delete";

  const Icon = isEdit ? FiEdit : isDelete ? FiTrash2 : FiClock;

  // Colors: gradient using theme yellow/red
  const bgGradient = isEdit
    ? "bg-gradient-to-tr from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600"
    : isDelete
    ? "bg-gradient-to-tr from-red-300 to-red-600 hover:from-red-600 hover:to-red-700"
    : "bg-gradient-to-tr from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className={`${bgGradient} text-white rounded-full 
                 w-10 h-10 inline-flex items-center justify-center 
                 shadow-lg hover:shadow-xl 
                 transition-transform duration-300 transform ${
                   disabled
                     ? "opacity-50 cursor-not-allowed"
                     : "hover:-translate-y-1"
                 }`}
    >
      <Icon size={24} />
    </button>
  );
};
