"use client";
import React, { useEffect, useMemo, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { Header, Button } from "@/utils/header";
import Loader from "@/utils/loader";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminAndSubadminProfile, updateAdminProfile } from "@/Api/AllApi";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  const canEdit = useMemo(() => role === "Admin", [role]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAdminAndSubadminProfile();
        setProfile(data || null);
      } catch (e) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        username: profile?.username,
        email: profile?.email,
        mobilePrefix: profile?.mobilePrefix,
        mobileNumber: profile?.mobileNumber,
      };
      await updateAdminProfile(payload);
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-18 py-6">
        <Header size="3xl">Profile</Header>
        <div className="text-gray-600 mt-4">No profile data.</div>
      </div>
    );
  }

  return (
    <RoleGuard allow={["Admin", "subadmin"]}>
      <div className="px-6 mx-7 md:px-12 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Header size="3xl" className="font-bold text-gray-800">
            My Profile
          </Header>
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Basic Info */}
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Basic Info
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={!canEdit}
                  className="w-full border-none shadow-sm  rounded-xl p-3 text-base"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!canEdit}
                  className="w-full border-none shadow-sm  rounded-xl p-3 text-base"
                />
              </div>
            </div>
          </div>

          {/* Right: Role & Branch */}
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Role & Branch
            </h3>
            <div className="space-y-3 text-gray-700 text-base">
              <div className="flex justify-between items-center">
                <span className="font-medium">Role</span>
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 text-black text-sm font-medium shadow">
                  {profile.adminType}
                </span>
              </div>

              {role === "subadmin" ? (
                <div className="space-y-3">
                  <div className="font-medium text-gray-800">Branch Details</div>
                  {Array.isArray(profile.branch) && profile.branch.length ? (
                    profile.branch.map((b) => (
                      <div
                        key={b._id}
                        className="p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-amber-200 shadow-sm hover:shadow-md transition text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium">{b.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address</span>
                          <span>{b.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">City</span>
                          <span>{b.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">State</span>
                          <span>{b.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact</span>
                          <span>
                            {b.mobilePrefix} {b.mobileNumber}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No branches assigned.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Admin does not have branch details.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ProfilePage;
