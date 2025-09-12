"use client";
import React from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";

const BranchTable = ({ items, loading, onEdit, onDelete }) => {
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
          title="No Branches"
          subtitle="Create a branch to get started."
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
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              City
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              State
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Pincode
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((b) => (
            <tr
              key={b._id}
              className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                {b.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {b.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {b.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {b.state}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {b.pincode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {b.email || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <ActionButton type="edit" onClick={() => onEdit(b)} />
                <ActionButton type="delete" onClick={() => onDelete(b._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTable;
