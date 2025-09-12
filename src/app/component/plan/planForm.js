"use client";
import { useEffect, useState } from "react";
import TimeButton from "@/utils/timebutton";
import { validateForm } from "@/utils/validation";

const PlanForm = ({
  initialData,
  onSubmit,
  onClose,
  submitLabel = "Save",
  loading = false,
  title = "Plan",
}) => {
  const [form, setForm] = useState({ name: "", description: "", days: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        days: initialData.days ?? "",
      });
    } else {
      setForm({ name: "", description: "", days: "" });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const required = (label) => (v) => !v ? `${label} is required` : null;
    const numberRule = (label) => (v) =>
      v === "" || isNaN(Number(v)) ? `${label} must be a number` : null;
    const errs = validateForm({
      name: { value: form.name, rules: [required("Name")] },
      description: {
        value: form.description,
        rules: [required("Description")],
      },
      days: { value: form.days, rules: [required("Days"), numberRule("Days")] },
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, days: Number(form.days) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
        {initialData ? `Update ${title}` : `Create ${title}`}
      </h2>
      <div>
        <label className="block mb-1 font-semibold text-gray-700">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="Plan name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

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
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Days</label>
        <input
          type="text"
          value={form.days}
          onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
          className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="e.g. 30"
        />
        {errors.days && (
          <p className="text-red-500 text-sm mt-1">{errors.days}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition font-semibold"
        >
          Cancel
        </button>
        <TimeButton type="submit" loading={loading}>
          {submitLabel}
        </TimeButton>
      </div>
    </form>
  );
};

export default PlanForm;
