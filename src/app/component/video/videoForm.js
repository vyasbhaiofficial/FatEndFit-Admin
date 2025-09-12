"use client";
import React, { useEffect, useMemo, useState } from "react";
import TimeButton from "@/utils/timebutton";
import toast from "react-hot-toast";
import { validateForm } from "@/utils/validation";
import Dropdown from "@/utils/dropdown";
import { getAllCategoriesApi } from "@/Api/AllApi";

const VideoForm = ({
  onSubmit,
  onCancel,
  loading,
  initialValues = null,
  submitLabel = "Create",
}) => {
  const [form, setForm] = useState({
    title: "",
    videoType: 1, // 1=file, 2=url
    videoFile: null,
    videoUrl: "",
    videoSecond: "",
    thumbnailType: 1, // 1=file, 2=url
    thumbnailFile: null,
    thumbnailUrl: "",
    description: "",
    type: 1, // 1..5
    day: "",
    category: [],
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        title: initialValues.title ?? "",
        videoType: initialValues.videoType ?? 1,
        videoFile: null,
        videoUrl:
          initialValues.videoType === 2 ? initialValues.video ?? "" : "",
        videoSecond:
          initialValues.videoType === 2 ? initialValues.videoSec ?? "" : "",
        thumbnailType: initialValues.thumbnailType ?? 1,
        thumbnailFile: null,
        thumbnailUrl:
          initialValues.thumbnailType === 2
            ? initialValues.thumbnail ?? ""
            : "",
        description: initialValues.description ?? "",
        type: initialValues.type ?? 1,
        day: initialValues.type === 1 ? initialValues.day ?? "" : "",
        category: Array.isArray(initialValues.category)
          ? initialValues.category
          : [],
      }));
      setErrors({});
    } else {
      setForm({
        title: "",
        videoType: 1,
        videoFile: null,
        videoUrl: "",
        videoSecond: "",
        thumbnailType: 1,
        thumbnailFile: null,
        thumbnailUrl: "",
        description: "",
        type: 1,
        day: "",
        category: [],
      });
      setErrors({});
    }
  }, [initialValues]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const list = await getAllCategoriesApi();
        setCategories(Array.isArray(list) ? list : []);
      } catch (e) {
        setCategories([]);
      }
    };
    loadCats();
  }, []);

  const validate = () => {
    const required = (label) => (v) => !v ? `${label} is required.` : null;
    const numberRule = (label) => (v) => {
      if (v === "" || v === "ok") return null;
      const n = Number(String(v).trim());
      return isNaN(n) ? `${label} must be a number.` : null;
    };
    const videoTypeNum = Number(form.videoType);
    const thumbTypeNum = Number(form.thumbnailType);
    const typeNum = Number(form.type);
    const errs = validateForm({
      title: { value: form.title, rules: [required("Title")] },
      videoUrl: {
        value: videoTypeNum === 2 ? form.videoUrl : "ok",
        rules: [required("Video URL")],
      },
      videoFile: {
        value: videoTypeNum === 1 ? form.videoFile : "ok",
        rules: [required("Video file")],
      },
      videoSecond: {
        value: videoTypeNum === 2 ? form.videoSecond : "ok",
        rules: [required("Video seconds"), numberRule("Video seconds")],
      },
      thumbnailUrl: {
        value: thumbTypeNum === 2 ? form.thumbnailUrl : "ok",
        rules: [required("Thumbnail URL")],
      },
      thumbnailFile: {
        value: thumbTypeNum === 1 ? form.thumbnailFile : "ok",
        rules: [required("Thumbnail file")],
      },
      type: { value: typeNum, rules: [required("Type")] },
      day: {
        value: typeNum === 1 ? form.day : "ok",
        rules: [required("Day"), numberRule("Day")],
      },
      category: {
        value: typeNum === 4 ? (form.category?.length ? "ok" : "") : "ok",
        rules: [required("Category")],
      },
    });
    setErrors(errs);
    if (Object.keys(errs).length) {
      // help debugging which field is blocking submit
      const firstKey = Object.keys(errs)[0];
      console.warn("Video form validation errors:", errs);
      toast.error(errs[firstKey]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // quick signal that handler is wired
    // remove later if noisy
    console.log("videoForm.handleSubmit invoked");
    if (!validate()) return;
    await onSubmit({
      ...form,
      videoSecond: form.videoSecond ? Number(form.videoSecond) : undefined,
      day: form.day ? Number(form.day) : undefined,
    });
  };

  const typeOptions = [
    { label: "Day wise (1)", value: 1 },
    { label: "Webinar/Live (2)", value: 2 },
    { label: "Testimonial (3)", value: 3 },
    { label: "Testimonial (4)", value: 4 },
    { label: "Setting (5)", value: 5 },
  ];

  const videoTypeOptions = [
    { label: "Upload File", value: 1 },
    { label: "Video URL", value: 2 },
  ];

  const thumbTypeOptions = [
    { label: "Upload File", value: 1 },
    { label: "Thumbnail URL", value: 2 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-1 font-semibold text-gray-700">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Dropdown
          label="Video Type"
          options={videoTypeOptions}
          value={form.videoType}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              videoType: v,
              videoFile: null,
              videoUrl: "",
              videoSecond: "",
            }))
          }
        />
        <Dropdown
          label="Thumbnail Type"
          options={thumbTypeOptions}
          value={form.thumbnailType}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              thumbnailType: v,
              thumbnailFile: null,
              thumbnailUrl: "",
            }))
          }
        />
      </div>

      {Number(form.videoType) === 1 ? (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Video File
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setForm((f) => ({ ...f, videoFile: e.target.files?.[0] || null }))
            }
            className="w-full border border-yellow-400 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {errors.videoFile && (
            <p className="text-red-500 text-sm mt-1">{errors.videoFile}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">
              Video URL
            </label>
            <input
              type="text"
              value={form.videoUrl ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, videoUrl: e.target.value }))
              }
              className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="https://..."
            />
            {errors.videoUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Seconds
            </label>
            <input
              type="text"
              value={form.videoSecond ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, videoSecond: e.target.value }))
              }
              className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            {errors.videoSecond && (
              <p className="text-red-500 text-sm mt-1">{errors.videoSecond}</p>
            )}
          </div>
        </div>
      )}

      {Number(form.thumbnailType) === 1 ? (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Thumbnail File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                thumbnailFile: e.target.files?.[0] || null,
              }))
            }
            className="w-full border border-yellow-400 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {errors.thumbnailFile && (
            <p className="text-red-500 text-sm mt-1">{errors.thumbnailFile}</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Thumbnail URL
          </label>
          <input
            type="text"
            value={form.thumbnailUrl ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="https://..."
          />
          {errors.thumbnailUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.thumbnailUrl}</p>
          )}
        </div>
      )}

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Type</label>
        <Dropdown
          options={typeOptions}
          value={form.type}
          onChange={(v) => setForm((f) => ({ ...f, type: v, day: "" }))}
          disabled={Boolean(initialValues)}
        />
      </div>

      {Number(form.type) === 1 && (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Day</label>
          <input
            type="text"
            value={form.day}
            onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="1"
          />
          {errors.day && (
            <p className="text-red-500 text-sm mt-1">{errors.day}</p>
          )}
        </div>
      )}

      {Number(form.type) === 4 && (
        <div>
          <Dropdown
            label="Category"
            options={categories.map((c) => ({
              label: c.categoryTitle,
              value: c._id,
            }))}
            value={form.category}
            onChange={(val) => setForm((f) => ({ ...f, category: val }))}
            placeholder="Select category"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
      )}

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition font-semibold"
        >
          Cancel
        </button>
        <TimeButton loading={loading} type="submit">
          {submitLabel}
        </TimeButton>
      </div>
    </form>
  );
};

export default VideoForm;
