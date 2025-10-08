"use client";
import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { Header, Button } from "@/utils/header";
import Drawer from "@/utils/formanimation";
import { createUserApi, getAllUsers, updateUserById } from "@/Api/AllApi";
import UserForm from "./UserForm";
import UserList from "./UserList";
import SearchComponent from "@/components/SearchComponent";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const UsersPage = () => {
  const { role, branches } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const fetchList = async () => {
    try {
      setListLoading(true);
      let userData = [];
      if (role === "subadmin") {
        const branchIds = Array.isArray(branches) ? branches : [];
        const chunks = await Promise.all(
          branchIds.map((id) =>
            import("@/Api/AllApi").then((m) => m.getUsersByBranch(id))
          )
        );
        userData = chunks.flat();
      } else {
        const data = await getAllUsers();
        userData = Array.isArray(data) ? data : [];
      }
      setUsers(userData);
      setFilteredUsers(userData);
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

  const applyFilters = (list, term, status) => {
    const base = Array.isArray(list) ? list : [];
    let data = base;
    // status filtering: active => isDeleted false, inactive => isDeleted true
    if (status === "active") data = data.filter((u) => !u.isDeleted);
    else if (status === "inactive") data = data.filter((u) => u.isDeleted);
    if (!term) return data;
    const t = term.toLowerCase();
    return data.filter(
      (user) =>
        (user.name || "").toLowerCase().includes(t) ||
        String(user.patientId || "").includes(t) ||
        String(user.mobileNumber || "").includes(t) ||
        `${user.mobilePrefix || ""}${user.mobileNumber || ""}`.includes(t) ||
        (user.branch?.name || "").toLowerCase().includes(t) ||
        (user.plan?.name || "").toLowerCase().includes(t)
    );
  };

  const handleSearch = (searchTerm) => {
    setSearchLoading(true);

    const filtered = applyFilters(users, searchTerm, filter);
    setFilteredUsers(filtered);
    setSearchLoading(false);
  };

  // React to dropdown filter changes
  useEffect(() => {
    setFilteredUsers(applyFilters(users, "", filter));
  }, [filter, users]);

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
      <div className="w-full h-full px-18 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <Header size="3xl">Users</Header>
          <Button onClick={() => setIsOpen(true)}>Create</Button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 flex-shrink-0">
            {error}
          </div>
        )}

        <SearchComponent
          onSearch={handleSearch}
          onFilterChange={setFilter}
          searchLoading={searchLoading}
          searchPlaceholder="Search by name, patient ID, mobile, or branch..."
          filterOptions={[
            { label: "All Users", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          filterValue={filter}
          filterLabel="Status"
        />

        {!listLoading && (
          <div className="mb-4 text-sm text-gray-600 flex-shrink-0">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}

        <div className="flex-1 min-h-0">
          <UserList
            users={filteredUsers}
            loading={listLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

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
