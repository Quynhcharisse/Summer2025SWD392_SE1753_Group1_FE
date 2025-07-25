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
            // Kiểm tra trạng thái các form
            const hasActiveForm = found.admissionForms && found.admissionForms.some(
              form => !['draft', 'cancelled', 'rejected', 'refilled'].includes((form.status || '').toLowerCase())
            );
            if (!hasActiveForm) {
              setError("Cannot update child info while there is an active admission form (pending/approved)");
            }
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
    if (error) return; // Không cho submit nếu có lỗi trạng thái
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
      <>
        {/* Overlay nền mờ */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)', // tăng opacity
          zIndex: 3000 // cao hơn mọi thứ khác
        }} />
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3100 // popup cao hơn overlay
        }}>
          <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', minWidth: 420, maxWidth: 520, width: '100%', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 24, color: '#07663a', marginBottom: 8, textAlign: 'center' }}>
              Edit Child Information
            </div>
            <div className="text-center py-8">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-600">Loading child info...</p>
            </div>
          </div>
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        {/* Overlay nền mờ */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 3000
        }} />
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3100
        }}>
          <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', minWidth: 420, maxWidth: 520, width: '100%', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 24, color: '#07663a', marginBottom: 8, textAlign: 'center' }}>
              Edit Child Information
            </div>
            <div className="text-center py-8 text-red-600">{error}</div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {/* Overlay nền mờ */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 3000
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3100
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'white',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            minWidth: 420,
            maxWidth: 520,
            width: '100%',
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            position: 'relative'
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 24, color: '#07663a', marginBottom: 8, textAlign: 'center' }}>
            Edit Child Information
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
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
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
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
            <div style={{ flex: 1 }}>
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
          </div>
          {/* Có thể bổ sung upload ảnh nếu muốn */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                border: '1.5px solid #07663a',
                color: '#07663a',
                borderRadius: 8,
                padding: '10px 28px',
                fontWeight: 600,
                background: 'white'
              }}
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditChildForm;
