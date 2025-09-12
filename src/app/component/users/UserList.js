"use client";
import React from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";

import { useRouter } from "next/navigation";

const UserList = ({ users, loading, onEdit, onDelete }) => {
  const router = useRouter();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          title="No Users"
          subtitle="Create a user to get started."
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
              Mobile
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Branch
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((u) => (
            <tr
              key={u._id}
              className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                {u.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {u.mobilePrefix} {u.mobileNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {u.branch?.name || u.branch || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {u.plan?.name || u.plan || "-"}
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <ActionButton type="edit" onClick={() => onEdit(u)} />
                <ActionButton type="delete" onClick={() => onDelete(u._id)} />
                <ActionButton
                  type="history"
                  onClick={() =>
                    router.push(`/component/users/${u._id}/profile`)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
