"use client";
import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
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
import SearchComponent from "@/components/SearchComponent";

const VideoPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const fetchList = async () => {
    try {
      setListLoading(true);
      const data = await listVideos();
      const videoData = Array.isArray(data) ? data : [];
      setVideos(videoData);
      setFilteredVideos(videoData);
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

  const handleSearch = (term) => {
    setSearchLoading(true);

    if (!term) {
      setFilteredVideos(videos);
      setSearchLoading(false);
      return;
    }

    const filtered = videos.filter((video) => {
      const searchTerm = term.toLowerCase();
      return (
        video.title_english?.toLowerCase().includes(searchTerm) ||
        video.title_gujarati?.toLowerCase().includes(searchTerm) ||
        video.title_hindi?.toLowerCase().includes(searchTerm) ||
        video.description_english?.toLowerCase().includes(searchTerm) ||
        video.description_gujarati?.toLowerCase().includes(searchTerm) ||
        video.description_hindi?.toLowerCase().includes(searchTerm) ||
        video.day?.toString().includes(searchTerm) ||
        video.category?.categoryTitle?.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredVideos(filtered);
    setSearchLoading(false);
  };

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
    setVideoToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      setLoading(true);
      setError("");
      await deleteVideoById(videoToDelete);
      await fetchList();
      toast.success("Video deleted successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete video");
      toast.error(err?.response?.data?.message || "Failed to delete video");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setVideoToDelete(null);
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

        <SearchComponent
          onSearch={handleSearch}
          searchLoading={searchLoading}
          searchPlaceholder="Search by title, description, day, or category..."
          filterOptions={[
            { label: "All Videos", value: "all" },
            { label: "Day Wise", value: "1" },
            { label: "Webinar/Live", value: "2" },
            { label: "Testimonial", value: "3" },
            { label: "Category Testimonial", value: "4" },
            { label: "Resume Plan", value: "5" },
          ]}
          filterValue="all"
          filterLabel="Type"
        />

        {!listLoading && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredVideos.length} of {videos.length} videos
          </div>
        )}

        <VideoTable
          items={filteredVideos}
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

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Video"
          message="Are you sure you want to delete this video? This action cannot be undone."
          type="danger"
        />
      </div>
    </RoleGuard>
  );
};

export default VideoPage;
