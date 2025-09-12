"use client";
import React, { useEffect, useState } from "react";
import TimeButton from "@/utils/timebutton";
import { validateForm, validateEmail } from "@/utils/validation";

const BranchForm = ({
  onSubmit,
  onCancel,
  loading,
  initialValues = null,
  submitLabel = "Create",
}) => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    latitude: "",
    longitude: "",
    mobilePrefix: "+91",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name ?? "",
        address: initialValues.address ?? "",
        city: initialValues.city ?? "",
        state: initialValues.state ?? "",
        pincode: initialValues.pincode ?? "",
        email: initialValues.email ?? "",
        latitude: initialValues.latitude ?? "",
        longitude: initialValues.longitude ?? "",
        mobilePrefix: initialValues.mobilePrefix ?? "+91",
        mobileNumber: initialValues.mobileNumber ?? "",
      });
      setErrors({});
    } else {
      setForm({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        email: "",
        latitude: "",
        longitude: "",
        mobilePrefix: "+91",
        mobileNumber: "",
      });
      setErrors({});
    }
  }, [initialValues]);

  const validate = () => {
    const required = (label) => (v) => !v ? `${label} is required.` : null;
    const errs = validateForm({
      name: { value: form.name, rules: [required("Name")] },
      email: { value: form.email, rules: [validateEmail] },
      city: { value: form.city, rules: [required("City")] },
      state: { value: form.state, rules: [required("State")] },
      pincode: { value: form.pincode, rules: [required("Pincode")] },
      mobilePrefix: {
        value: form.mobilePrefix,
        rules: [required("Mobile prefix")],
      },
      mobileNumber: {
        value: form.mobileNumber,
        rules: [required("Mobile number")],
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="Branch name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="demo@gmail.com"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Address
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="House/Street, Area"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            State
          </label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="State"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            value={form.pincode}
            onChange={(e) =>
              setForm((f) => ({ ...f, pincode: e.target.value }))
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="400001"
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            value={form.latitude}
            onChange={(e) =>
              setForm((f) => ({ ...f, latitude: e.target.value }))
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="19.0760"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            value={form.longitude}
            onChange={(e) =>
              setForm((f) => ({ ...f, longitude: e.target.value }))
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="72.8777"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Prefix
          </label>
          <input
            type="text"
            value={form.mobilePrefix}
            onChange={(e) =>
              setForm((f) => ({ ...f, mobilePrefix: e.target.value }))
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="+91"
          />
          {errors.mobilePrefix && (
            <p className="text-red-500 text-sm mt-1">{errors.mobilePrefix}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 font-semibold text-gray-700">
            Mobile
          </label>
          <input
            type="text"
            value={form.mobileNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, mobileNumber: e.target.value }))
            }
            className="w-full border border-yellow-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="9123456789"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
          )}
        </div>
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

export default BranchForm;
