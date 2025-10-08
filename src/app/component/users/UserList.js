"use client";
import React, { useState } from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { useRouter } from "next/navigation";

const ThemedCheckbox = ({ checked, onChange, ariaLabel }) => {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span className="w-5 h-5 rounded-md border border-yellow-400 bg-white peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-300 peer-checked:border-amber-400 shadow-sm flex items-center justify-center transition-all">
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

const UserList = ({ users, loading, onEdit, onDelete, onBulkDelete }) => {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null,
    userName: null,
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

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

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === users.length) return new Set();
      return new Set(users.map((u) => u._id));
    });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return setBulkDialogOpen(false);
    if (onBulkDelete) {
      await onBulkDelete(ids);
    } else {
      // Fallback: call onDelete for each
      for (const id of ids) {
        // Sequential to keep API happy
        // eslint-disable-next-line no-await-in-loop
        await onDelete(id);
      }
    }
    setSelectedIds(new Set());
    setBulkDialogOpen(false);
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
      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white h-full">
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-amber-50">
            <p className="text-sm text-amber-800 font-semibold">
              {selectedIds.size} selected
            </p>
            <button
              onClick={() => setBulkDialogOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-300 text-black text-sm font-semibold shadow hover:from-yellow-500 hover:to-amber-400 transition"
            >
              Delete Selected
            </button>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-yellow-400 to-amber-300">
            <tr>
              <th className="px-4 py-3 text-left">
                <ThemedCheckbox
                  checked={
                    selectedIds.size === users.length && users.length > 0
                  }
                  onChange={toggleAll}
                  ariaLabel="Select all"
                />
              </th>
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

              const isDeleted = Boolean(u.isDeleted);
              return (
                <tr
                  key={u._id}
                  className={`relative hover:bg-yellow-50 transition-all duration-200 cursor-pointer ${
                    isDeleted ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-4 py-4">
                    <ThemedCheckbox
                      checked={selectedIds.has(u._id)}
                      onChange={() => toggleOne(u._id)}
                      ariaLabel={`Select ${u.name}`}
                    />
                  </td>
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
                      disabled={isDeleted}
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

      {/* Bulk Delete Confirmation */}
      <ConfirmationDialog
        isOpen={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Users"
        message={`Are you sure you want to delete ${selectedIds.size} selected user(s)? This will mark them as deleted.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default UserList;
