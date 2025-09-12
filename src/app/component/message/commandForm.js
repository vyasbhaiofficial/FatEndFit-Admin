"use client";
import { useState, useEffect, useRef } from "react";
import Loader from "@/utils/loader";
import Dropdown from "@/utils/dropdown";

const TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "audio", label: "Audio" },
];

const CommandForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    type: "text",
    title: "",
    description: "",
    audio: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        title: initialData.title,
        description: initialData.description || "",
        audio: null,
      });
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (formData.type === "text" && !formData.description.trim())
      newErrors.description = "Description required";
    if (formData.type === "audio" && !formData.audio && !initialData)
      newErrors.audio = "Audio file required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl relative">
      {loading && <Loader />}
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
        {initialData ? "Update Command" : "Create Command"}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Modern Dropdown */}
        <div className="w-full">
          <Dropdown
            label="Type"
            options={TYPE_OPTIONS}
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val })}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        {formData.type === "text" && (
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none h-24"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        )}

        {/* Audio */}
        {formData.type === "audio" && (
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Upload Audio
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setFormData({ ...formData, audio: e.target.files[0] })
              }
              className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            {errors.audio && (
              <p className="text-red-500 text-sm mt-1">{errors.audio}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition"
          >
            {initialData ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommandForm;
