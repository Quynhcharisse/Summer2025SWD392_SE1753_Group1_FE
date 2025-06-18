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
      setSuccess("Cập nhật thành công!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin trẻ</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Họ tên</label>
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
        <label className="block mb-1 font-medium">Giới tính</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Ngày sinh</label>
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
        <label className="block mb-1 font-medium">Nơi sinh</label>
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
        {loading ? <Spinner size="sm" /> : "Lưu thay đổi"}
      </Button>
    </form>
  );
};

export default ChildEditForm; 