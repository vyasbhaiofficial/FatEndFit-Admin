"use client";
import React, { useEffect, useState } from "react";
import TimeButton from "@/utils/timebutton";
import { validateForm } from "@/utils/validation";

const CategoryForm = ({
  onSubmit,
  onCancel,
  loading,
  initialValues = null,
  submitLabel = "Create",
}) => {
  const [form, setForm] = useState({ categoryTitle: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm({ categoryTitle: initialValues.categoryTitle || "" });
      setErrors({});
    } else {
      setForm({ categoryTitle: "" });
      setErrors({});
    }
  }, [initialValues]);

  const validate = () => {
    const required = (label) => (v) => !v ? `${label} is required.` : null;
    const errs = validateForm({
      categoryTitle: {
        value: form.categoryTitle,
        rules: [required("Category title")],
      },
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Category Title
        </label>
        <input
          type="text"
          value={form.categoryTitle}
          onChange={(e) =>
            setForm((f) => ({ ...f, categoryTitle: e.target.value }))
          }
          className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="Fitness"
        />
        {errors.categoryTitle && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryTitle}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition font-semibold"
        >
          Cancel
        </button>
        <TimeButton loading={loading}>{submitLabel}</TimeButton>
      </div>
    </form>
  );
};

export default CategoryForm;
