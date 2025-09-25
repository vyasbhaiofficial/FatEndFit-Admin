"use client";
import React, { useState } from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { useRouter } from "next/navigation";

const UserList = ({ users, loading, onEdit, onDelete }) => {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null,
    userName: null,
  });

  const handleDeleteClick = (userId, userName) => {
    setDeleteDialog({
      isOpen: true,
      userId,
      userName,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.userId) {
      onDelete(deleteDialog.userId);
    }
    setDeleteDialog({
      isOpen: false,
      userId: null,
      userName: null,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      userId: null,
      userName: null,
    });
  };
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
          title="No Users Found"
          subtitle="No users match your search criteria. Try adjusting your search or create a new user."
        />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-yellow-400 to-amber-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Patient ID
              </th>
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
                Plan Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => {
              // Determine plan status - only Active or Hold
              const getPlanStatus = () => {
                if (!u.activated || !u.plan) {
                  return {
                    status: "No Plan",
                    color: "bg-gray-100 text-gray-800",
                  };
                }
                if (u.planHoldDate && !u.planResumeDate) {
                  return {
                    status: "Hold",
                    color: "bg-amber-300 text-amber-800",
                  };
                }
                return {
                  status: "Active",
                  color: "bg-yellow-300 text-yellow-900",
                };
              };

              const planStatus = getPlanStatus();

              return (
                <tr
                  key={u._id}
                  className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono">
                    {u.patientId || "-"}
                  </td>
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
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${planStatus.color}`}
                    >
                      {planStatus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <ActionButton type="edit" onClick={() => onEdit(u)} />
                    <ActionButton
                      type="delete"
                      onClick={() => handleDeleteClick(u._id, u.name)}
                    />
                    <ActionButton
                      type="history"
                      onClick={() =>
                        router.push(`/component/users/${u._id}/profile`)
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteDialog.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default UserList;
