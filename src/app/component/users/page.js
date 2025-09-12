"use client";
import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { Header, Button } from "@/utils/header";
import Drawer from "@/utils/formanimation";
import { createUserApi, getAllUsers, updateUserById } from "@/Api/AllApi";
import UserForm from "./UserForm";
import UserList from "./UserList";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const UsersPage = () => {
  const { role, branches } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchList = async () => {
    try {
      setListLoading(true);
      if (role === "subadmin") {
        const branchIds = Array.isArray(branches) ? branches : [];
        const chunks = await Promise.all(
          branchIds.map((id) =>
            import("@/Api/AllApi").then((m) => m.getUsersByBranch(id))
          )
        );
        const merged = chunks.flat();
        setUsers(merged);
      } else {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load users");
      toast.error(e?.response?.data?.message || "Failed to load users");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");
      if (editing) {
        await updateUserById(editing._id, formData);
        toast.success("User updated successfully!");
      } else {
        await createUserApi(formData);
        toast.success("User created successfully!");
      }
      await fetchList();
      setIsOpen(false);
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save user");
      toast.error(err?.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");
      // Ensure branchId and planId are sent to satisfy backend validation
      const current = Array.isArray(users)
        ? users.find((u) => u._id === id)
        : null;
      const branchId = current?.branch?._id || current?.branch;
      const planId = current?.plan?._id || current?.plan;
      await updateUserById(id, { isDeleted: true, branchId, planId });
      await fetchList();
      toast.success("User deleted successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
      toast.error(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allow={["Admin", "subadmin"]}>
      <div className="w-full h-full px-18">
        <div className="flex items-center justify-between mb-4">
          <Header size="3xl">Users</Header>
          <Button onClick={() => setIsOpen(true)}>Create</Button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <UserList
          users={users}
          loading={listLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-yellow-600">
              {editing ? "Update User" : "Create User"}
            </h2>
          </div>
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsOpen(false);
              setEditing(null);
            }}
            loading={loading}
            initialValues={editing}
            submitLabel={editing ? "Update" : "Create"}
          />
        </Drawer>
      </div>
    </RoleGuard>
  );
};

export default UsersPage;
