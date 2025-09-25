"use client";
import React, { useState } from "react";
import Loader from "@/utils/loader";
import NotFoundCard from "@/components/NotFoundCard";
import { ActionButton } from "@/utils/actionbutton";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const BranchTable = ({ items, loading, onEdit, onDelete }) => {
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
    <>
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
                <ActionButton type="delete" onClick={() => handleDeleteClick(b._id, b.name || 'Branch')} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Delete Confirmation Dialog */}
    <ConfirmationDialog
      isOpen={deleteDialog.isOpen}
      onClose={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      title="Delete Branch"
      message={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      type="danger"
    />
    </>
  );
};


export default BranchTable;
