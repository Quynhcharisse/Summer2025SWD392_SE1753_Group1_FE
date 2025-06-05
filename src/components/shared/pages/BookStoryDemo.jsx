import React, { useState } from "react";
import { PageTemplate } from "@templates";
import { FormField as InputField } from "@molecules";
import CalendarIcon from "@icons/CalendarIcon";
import LockIcon from "@icons/LockIcon";

export default function BookStoryDemo() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    password: "",
    story: "",
  });
  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên không được để trống";
    if (!form.date) newErrors.date = "Vui lòng chọn ngày";
    if (!form.password) newErrors.password = "Mật khẩu không được để trống";
    if (!form.story.trim()) newErrors.story = "Bạn phải nhập nội dung truyện";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setShowResult(true);
    else setShowResult(false);
  };

  return (
    <PageTemplate title="Book Story Input Demo" subtitle="Trình diễn InputField đa chức năng">
      <form className="max-w-lg mx-auto space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="name"
          name="name"
          label="Tên người đặt"
          placeholder="Nhập tên của bạn"
          required
          value={form.name}
          onChange={e => handleChange("name")(e.target.value)}
          error={errors.name}
          tooltip="Tên thật của bạn để xác nhận đặt truyện"
        />
        <InputField
          id="date"
          name="date"
          label="Ngày đặt"
          type="date"
          required
          value={form.date}
          onChange={e => handleChange("date")(e.target.value)}
          error={errors.date}
          icon={<CalendarIcon />}
          tooltip="Chọn ngày bạn muốn đặt truyện"
        />
        <InputField
          id="password"
          name="password"
          label="Mật khẩu truy cập"
          type="password"
          required
          value={form.password}
          onChange={e => handleChange("password")(e.target.value)}
          error={errors.password}
          icon={<LockIcon />}
          tooltip="Mật khẩu để bảo vệ truyện của bạn"
          showPasswordToggle
        />
        <InputField
          id="story"
          name="story"
          label="Nội dung truyện"
          as="textarea"
          required
          value={form.story}
          onChange={e => handleChange("story")(e.target.value)}
          error={errors.story}
          placeholder="Nhập nội dung truyện bạn muốn đặt..."
          tooltip="Viết nội dung truyện bạn muốn đặt"
          rows={4}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Đặt truyện</button>
      </form>
      {showResult && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-green-700 mb-2">Kết quả đặt truyện:</h3>
          <div><b>Tên:</b> {form.name}</div>
          <div><b>Ngày đặt:</b> {form.date}</div>
          <div><b>Nội dung:</b> {form.story}</div>
        </div>
      )}
    </PageTemplate>
  );
}
