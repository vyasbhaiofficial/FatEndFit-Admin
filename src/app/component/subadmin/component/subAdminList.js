"use client";
import React, { useState } from "react";
import { API_BASE } from "@/Api/AllApi";
import { ActionButton } from "@/utils/actionbutton";
import NotFoundCard from "@/components/NotFoundCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const SubAdminList = ({ subAdmins, onEdit, onDelete, loading = false }) => {
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: null,
  });

  const handleDeleteClick = (itemId, itemName) => {
    setDeleteDialog({
      isOpen: true,
      itemId,
      itemName,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.itemId) {
      onDelete(deleteDialog.itemId);
    }
    setDeleteDialog({
      isOpen: false,
      itemId: null,
      itemName: null,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      itemId: null,
      itemName: null,
    });
  };
  if (loading) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          loading
          title="Loading"
          subtitle="Fetching sub admins..."
        />
      </div>
    );
  }

  if (!subAdmins || subAdmins.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <NotFoundCard
          title="No Sub Admins"
          subtitle="Create a sub admin to get started."
        />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gradient-to-r from-yellow-400 to-amber-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Branches
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {subAdmins.length > 0 ? (
              subAdmins.map((sa) => (
                <tr
                  key={sa._id}
                  className="hover:bg-yellow-50 transition-all duration-200 cursor-pointer"
                >
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sa.image ? (
                      <img
                        src={`${API_BASE}/${sa.image}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                    {sa.username}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {sa.email}
                  </td>

                  {/* Branches */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {Array.isArray(sa.branch) && sa.branch.length
                      ? sa.branch.map((b) => b.name).join(", ")
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center space-x-2">
                    <ActionButton type="edit" onClick={() => onEdit(sa)} />
                    <ActionButton
                      type="delete"
                      onClick={() =>
                        handleDeleteClick(sa._id, sa.name || "Sub Admin")
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No Sub Admins
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub Admin"
        message={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default SubAdminList;
