import React, { useState } from "react";
import { Button, Spinner } from "@atoms";
import apiClient from "@api/apiClient";

const ChildEditForm = ({ child, onSuccess }) => {
  const [form, setForm] = useState({
    id: child?.id || "",
    name: child?.name || "",
    gender: child?.gender || "",
    dateOfBirth: child?.dateOfBirth || "",
    placeOfBirth: child?.placeOfBirth || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiClient.put("/parent/child", form);
      setSuccess("Updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Child Information</h2>
      
      {/* Warning Message */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                ⚠️ <strong>Editing this information may affect your child's enrollment records.</strong>
              </p>
              <p className="mt-1">
                • Please carefully review the information before saving changes
              </p>
              <p className="mt-1">
                • Information must match your child's official documents
              </p>
              <p className="mt-1">
                • Contact the school if you need assistance with any errors
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Gender</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Place of Birth</label>
        <input
          type="text"
          name="placeOfBirth"
          value={form.placeOfBirth}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Save Changes"}
      </Button>
    </form>
  );
};

export default ChildEditForm; 