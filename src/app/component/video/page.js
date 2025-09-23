"use client";
import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { Header, Button } from "@/utils/header";
import Drawer from "@/utils/formanimation";
import toast from "react-hot-toast";
import {
  listVideos,
  createVideoApi,
  updateVideoById,
  deleteVideoById,
} from "@/Api/AllApi";
import VideoForm from "./videoForm";
import VideoTable from "./videoTable";

const VideoPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);
  const [editing, setEditing] = useState(null);
  const fetchList = async () => {
    try {
      setListLoading(true);
      const data = await listVideos();
      setVideos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load videos");
      toast.error(e?.response?.data?.message || "Failed to load videos");
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
        await updateVideoById(editing._id, formData);
        toast.success("Video updated successfully!");
      } else {
        await createVideoApi(formData);
        toast.success("Video created successfully!");
      }
      await fetchList();
      setIsOpen(false);
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save video");
      toast.error(err?.response?.data?.message || "Failed to save video");
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
      await deleteVideoById(id);
      await fetchList();
      toast.success("Video deleted successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete video");
      toast.error(err?.response?.data?.message || "Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allow={["Admin"]}>
      <div className="w-full h-full px-18">
        <div className="flex items-center justify-between mb-4">
          <Header size="3xl">Videos</Header>
          <Button onClick={() => setIsOpen(true)}>Create</Button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            {error}
          </div>
        )}

        <VideoTable
          items={videos}
          loading={listLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-yellow-600">
              {editing ? "Update Video" : "Create Video"}
            </h2>
          </div>
          <VideoForm
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

export default VideoPage;
