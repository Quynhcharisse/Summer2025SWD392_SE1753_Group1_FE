import { Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";
import { Baby, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getChildren,
  updateChild,
  deleteChild,
} from "@api/services/parentService";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { uploadImageToCloudinary, validateImage } from "@utils/cloudinary";

const MAX_EDIT_TIMES = 5;

const ChildList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [admissionTerms, setAdmissionTerms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editCounts, setEditCounts] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    profileImage: "",
    birthCertificateImg: "",
    householdRegistrationImg: "",
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getChildren();
        // console.log("Fetching children data:", response);

        if (response.data) {
          setChildren(response.data);
        } else {
          setChildren([]);
          setError("No child information found");
        }
      } catch (err) {
        // console.error("Failed to fetch children:", err);
        setError("Error fetching child list information");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [refresh]);

  useEffect(() => {
    setAdmissionTerms([
      { id: 1, name: "Fall 2025" },
      { id: 2, name: "Spring 2026" },
    ]);
  }, []);

  const handleAddChild = () => {
    navigate("/user/parent/add-child");
  };

  const handleSelectChild = (child) => {
    navigate(`/user/parent/forms`, {
      state: { studentId: child.id },
    });
  };

  const GetForm = () => setRefresh((r) => !r);

  const openEditModal = (child) => {
    setEditingChild(child);
    setEditForm({
      name: child.name || "",
      gender: child.gender || "",
      dateOfBirth: child.dateOfBirth ? child.dateOfBirth.slice(0, 10) : "",
      placeOfBirth: child.placeOfBirth || "",
      profileImage: child.profileImage || "",
      birthCertificateImg: child.birthCertificateImg || "",
      householdRegistrationImg: child.householdRegistrationImg || "",
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingChild(null);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Lưu file ảnh vào state, chỉ upload khi nhấn Save
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        validateImage(files[0]);
        setEditForm((prev) => ({ ...prev, [name]: files[0] }));
      } catch (error) {
        enqueueSnackbar(error.message || "Invalid image.", { variant: "error" });
      }
    }
  };

  const handleEditChild = async () => {
    if (!editingChild) return;
    if ((editCounts[editingChild.id] || 0) >= MAX_EDIT_TIMES) {
      enqueueSnackbar(
        "You have reached the maximum number of edits (5) for this child.",
        { variant: "warning" }
      );
      return;
    }
    try {
      // Upload images nếu là file, còn nếu là url thì giữ nguyên
      let profileImage = editForm.profileImage;
      let birthCertificateImg = editForm.birthCertificateImg;
      let householdRegistrationImg = editForm.householdRegistrationImg;
      if (profileImage instanceof File) {
        profileImage = await uploadImageToCloudinary(profileImage);
      }
      if (birthCertificateImg instanceof File) {
        birthCertificateImg = await uploadImageToCloudinary(birthCertificateImg);
      }
      if (householdRegistrationImg instanceof File) {
        householdRegistrationImg = await uploadImageToCloudinary(householdRegistrationImg);
      }
      await updateChild({
        ...editingChild,
        ...editForm,
        profileImage,
        birthCertificateImg,
        householdRegistrationImg,
      });
      setEditCounts((prev) => ({
        ...prev,
        [editingChild.id]: (prev[editingChild.id] || 0) + 1,
      }));
      setRefresh(prev => !prev);
      enqueueSnackbar("Child updated successfully.", { variant: "success" });
      closeEditModal();
    } catch (err) {
      enqueueSnackbar("Failed to update child.", { variant: "error" });
    }
  };

  const handleDeleteChild = async (childId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this child? This action cannot be undone."
      )
    ) {
      try {
        await deleteChild(childId);
        setRefresh(prev => !prev);
        enqueueSnackbar("Child deleted successfully.", { variant: "success" });
      } catch (err) {
        enqueueSnackbar("Failed to delete child.", { variant: "error" });
      }
    }
  };

  const handleEnrollChild = (child) => {
    navigate("/user/parent/forms", { state: { studentId: child.id } });
  };

  if (loading) {
    return (
      <PageTemplate title="Child List">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading child list...</p>
        </div>
      </PageTemplate>
    );
  }
  return (
    <PageTemplate
      title="Child List"
      subtitle="Select a child for enrollment or add a new child"
      actions={
        <Button variant="primary" size="md" onClick={handleAddChild}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Child
        </Button>
      }
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {children.length === 0 && !error ? (
        <div className="text-center py-12">
          <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Child Information
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You don't have any children registered yet. Please add a child to
            continue.
          </p>
          <Button variant="primary" onClick={handleAddChild}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Child
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-lg border hover:border-blue-300 shadow-sm hover:shadow transition-all p-6"
            >
              <div className="flex justify-between items-start">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {child.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {child.gender === "male"
                      ? "Male"
                      : child.gender === "female"
                      ? "Female"
                      : "Other"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex space-x-2">
                  <span className="text-gray-500 text-sm">Date of Birth:</span>
                  <span className="text-gray-700 text-sm">
                    {new Date(child.dateOfBirth).toLocaleDateString("en-US")}
                  </span>
                </div>
                {child.placeOfBirth && (
                  <div className="flex space-x-2">
                    <span className="text-gray-500 text-sm">
                      Place of Birth:
                    </span>
                    <span className="text-gray-700 text-sm">
                      {child.placeOfBirth}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="primary"
                className="w-full mb-2"
                onClick={() => handleEnrollChild(child)}
              >
                Enroll
              </Button>
              <Button
                variant="secondary"
                className="w-full mb-2"
                onClick={() => openEditModal(child)}
                disabled={(editCounts[child.id] || 0) >= MAX_EDIT_TIMES}
              >
                Edit ({editCounts[child.id] || 0}/5)
              </Button>
              {/* Ẩn nút xóa child trong UI
              <Button
                variant="danger"
                className="w-full"
                onClick={() => handleDeleteChild(child.id)}
              >
                Delete
              </Button> */}
            </div>
          ))}
        </div>
      )}
    </PageTemplate>
  );
};

export default ChildList;
