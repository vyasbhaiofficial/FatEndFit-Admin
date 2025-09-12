"use client";
import React from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";

const CategoryTable = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          title="No Categories"
          subtitle="Create a category to get started."
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-yellow-400 to-amber-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((c) => (
            <tr
              key={c._id}
              className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                {c.categoryTitle}
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <ActionButton type="edit" onClick={() => onEdit(c)} />
                <ActionButton type="delete" onClick={() => onDelete(c._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
