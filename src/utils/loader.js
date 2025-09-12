"use client";
import { FiLoader } from "react-icons/fi";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-2 text-yellow-500">
      <FiLoader className="animate-spin text-3xl" />
      <span className="text-sm font-medium text-gray-600">{text}</span>
    </div>
  );
}
