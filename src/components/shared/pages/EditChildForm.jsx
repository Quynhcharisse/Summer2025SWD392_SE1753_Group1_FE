import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";

const EditChildForm = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    profileImage: "",
    birthCertificateImg: "",
    householdRegistrationImg: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        setLoading(true);
        const res = await parentService.getChildren();
        if (res.data && res.data.data) {
          const found = res.data.data.find((c) => String(c.id) === String(childId));
          if (found) {
            setChild(found);
            setForm({
              name: found.name || "",
              gender: found.gender || "",
              dateOfBirth: found.dateOfBirth || "",
              placeOfBirth: found.placeOfBirth || "",
              profileImage: found.profileImage || "",
              birthCertificateImg: found.birthCertificateImg || "",
              householdRegistrationImg: found.householdRegistrationImg || ""
            });
          } else {
            setError("Child not found");
          }
        }
      } catch (err) {
        setError("Failed to fetch child info");
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [childId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await parentService.updateChild({
        id: childId,
        ...form
      });
      if (res.data && res.data.success) {
        navigate(-1);
      } else {
        setError(res.data?.message || "Update failed");
      }
    } catch (err) {
      setError("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageTemplate title="Edit Child">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading child info...</p>
        </div>
      </PageTemplate>
    );
  }
  if (error) {
    return (
      <PageTemplate title="Edit Child">
        <div className="text-center py-8 text-red-600">{error}</div>
      </PageTemplate>
    );
  }
  return (
    <PageTemplate title="Edit Child">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Place of Birth</label>
          <input
            type="text"
            name="placeOfBirth"
            value={form.placeOfBirth}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        {/* Có thể bổ sung upload ảnh nếu muốn */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : "Save"}
          </Button>
        </div>
      </form>
    </PageTemplate>
  );
};

export default EditChildForm;
