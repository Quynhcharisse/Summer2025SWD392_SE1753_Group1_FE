import { getChildren, updateChild } from "@api/services/parentService";
import { Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";
import { AlertCircle, Baby, CheckCircle, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import RenderFormPopUp from "./RenderFormPopUp";
import { Visibility } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';
const MAX_EDIT_TIMES = 5;

// Constants from AddChildForm
const ALLOWED_IMAGE_TYPES = [
  "image/png", 
  "image/jpeg", 
  "image/jpg", 
  "image/webp",
];
const MIN_AGE = 3;
const MAX_AGE = 5;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Utility functions from AddChildForm
const capitalizeFirstLetter = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const validateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= MIN_AGE && age <= MAX_AGE;
};

const getValidYearRange = () => {
  const currentYear = new Date().getFullYear();
  return {
    minYear: currentYear - MAX_AGE,
    maxYear: currentYear - MIN_AGE,
  };
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pes_swd");
  formData.append("api_key", "837117616828593");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  return data.url;
};

const getGenderLabel = (gender) => {
  switch (gender) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return "Other";
  }
};

const getDocumentFieldName = (type) => {
  switch (type) {
    case "profile":
      return "profileImage";
    case "birth":
      return "birthCertificateImg";
    case "house":
      return "householdRegistrationImg";
    default:
      return "";
  }
};

const getDocumentDisplayName = (type) => {
  switch (type) {
    case "profile":
      return "Profile image";
    case "birth":
      return "Birth certificate";
    case "house":
      return "Household registration";
    default:
      return "Document";
  }
};

const getBorderColor = (hasPreview, hasError) => {
  if (hasPreview) return "border-blue-500";
  if (hasError) return "border-red-500";
  return "border-gray-300";
};

const ChildList = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [admissionTerms, setAdmissionTerms] = useState([]);
  const [editCounts, setEditCounts] = useState({});

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState("");
  const [uploadedFile, setUploadedFile] = useState({
    profile: null,
    birth: null,
    house: null,
    profilePreview: null,
    birthPreview: null,
    housePreview: null,
  });
  const [hasFileChanges, setHasFileChanges] = useState(false);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [documentErrors, setDocumentErrors] = useState({
    profile: "",
    birth: "",
    house: "",
  });
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [changesList, setChangesList] = useState([]);

  // React Hook Form for edit modal
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    setValue,
    getValues,
    reset,
  } = useForm();

  const { minYear, maxYear } = getValidYearRange();
  const minDate = `${minYear}-01-01`;
  const maxDate = `${maxYear}-12-31`;

  // Calculate total size of all uploaded files
  const calculateTotalFileSize = (files) => {
    let totalSize = 0;
    Object.values(files).forEach((file) => {
      if (file) totalSize += file.size;
    });
    return totalSize;
  };

  // Handle file upload with validation (from AddChildForm)
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Clear any existing document error for this type
      setDocumentErrors(prev => ({ ...prev, [type]: "" }));
      
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        const errorMessage = "Please upload a valid image file (PNG, JPEG, JPG, WEBP)";
        setDocumentErrors(prev => ({ ...prev, [type]: errorMessage }));
        enqueueSnackbar(errorMessage, { variant: "error" });
        return;
      }

      // Calculate the total size of all files
      const totalSize = calculateTotalFileSize({
        profile: type === "profile" ? file : uploadedFile.profile,
        birth: type === "birth" ? file : uploadedFile.birth,
        house: type === "house" ? file : uploadedFile.house,
      });

      // Check if the total file size exceeds the limit
      if (totalSize > MAX_FILE_SIZE_BYTES) {
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        const displayErrorMessage = `Total file size exceeds ${MAX_FILE_SIZE_MB}MB limit (${totalSizeMB}MB/${MAX_FILE_SIZE_MB}MB)`;
        enqueueSnackbar(displayErrorMessage, { variant: "error" });
        setFileSizeError(displayErrorMessage);
        return;
      } else {
        setFileSizeError("");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile((prev) => ({
          ...prev,
          [`${type}Preview`]: reader.result,
          [type]: file,
        }));
        setHasFileChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle removing uploaded file
  const handleRemoveFile = (type) => {
    const currentChild = editingChild;
    const fieldName = getDocumentFieldName(type);
    const originalImageUrl = currentChild?.[fieldName];
    
    // If removing a file and there's no existing file, show error
    if (!originalImageUrl) {
      const errorMessage = `${getDocumentDisplayName(type)} is required`;
      setDocumentErrors(prev => ({ ...prev, [type]: errorMessage }));
      enqueueSnackbar(errorMessage, { variant: "error" });
      return;
    }

    // Clear the uploaded file and revert to original image
    setUploadedFile((prev) => {
      const newState = {
        ...prev,
        [type]: null, // Clear the new uploaded file
        [`${type}Preview`]: originalImageUrl, // Revert to original image URL
      };
      return newState;
    });
    
    // Clear any error for this document type
    setDocumentErrors(prev => ({ ...prev, [type]: "" }));
    setHasFileChanges(true);
  };

  // Auto-capitalize handler for text inputs
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "placeOfBirth") {
      setValue(name, capitalizeFirstLetter(value));
    }
    setHasFormChanges(true); // Mark as having form changes when text is modified
  };

  // Generic handler for all form field changes
  const handleFormFieldChange = (e) => {
    setHasFormChanges(true);
  };

  const openEditModal = (child) => {
    setEditingChild(child);
    
    // Reset form with child data
    reset({
      name: child.name || "",
      gender: child.gender || "",
      dateOfBirth: child.dateOfBirth?.slice(0, 10) || "",
      placeOfBirth: child.placeOfBirth || "",
    });

    // Reset uploaded files but keep existing URLs for preview
    setUploadedFile({
      profile: null,
      birth: null,
      house: null,
      profilePreview: child.profileImage || null,
      birthPreview: child.birthCertificateImg || null,
      housePreview: child.householdRegistrationImg || null,
    });

    setFileSizeError("");
    setHasFileChanges(false);
    setHasFormChanges(false);
    setDocumentErrors({ profile: "", birth: "", house: "" });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingChild(null);
    setUploadedFile({
      profile: null,
      birth: null,
      house: null,
      profilePreview: null,
      birthPreview: null,
      housePreview: null,
    });
    setFileSizeError("");
    setHasFileChanges(false);
    setHasFormChanges(false);
    setDocumentErrors({ profile: "", birth: "", house: "" });
    setShowCloseConfirmation(false);
    setShowSaveConfirmation(false);
    setChangesList([]);
    reset();
  };

  const handleCloseModal = () => {
    // If no changes have been made, close directly
    if (!hasFileChanges && !hasFormChanges) {
      closeEditModal();
      return;
    }
    
    // If there are changes, show confirmation dialog
    setShowCloseConfirmation(true);
  };

  const confirmCloseModal = () => {
    closeEditModal();
  };

  const cancelCloseModal = () => {
    setShowCloseConfirmation(false);
  };

  // Function to detect changes between original and current data
  const detectChanges = (originalData, currentData) => {
    const changes = [];
    
    // Helper function to get gender label
    const getGenderLabel = (gender) => {
      switch(gender) {
        case 'MALE': return 'Male';
        case 'FEMALE': return 'Female';
        default: return gender;
      }
    };
    
    // Check form field changes
    if (originalData.name !== currentData.name) {
      changes.push({
        field: "Full Name",
        from: originalData.name,
        to: currentData.name
      });
    }
    
    if (originalData.gender !== currentData.gender) {
      changes.push({
        field: "Gender",
        from: getGenderLabel(originalData.gender),
        to: getGenderLabel(currentData.gender)
      });
    }
    
    if (originalData.dateOfBirth?.slice(0, 10) !== currentData.dateOfBirth) {
      changes.push({
        field: "Date of Birth",
        from: new Date(originalData.dateOfBirth).toLocaleDateString("en-US"),
        to: new Date(currentData.dateOfBirth).toLocaleDateString("en-US")
      });
    }
    
    if (originalData.placeOfBirth !== currentData.placeOfBirth) {
      changes.push({
        field: "Place of Birth",
        from: originalData.placeOfBirth,
        to: currentData.placeOfBirth
      });
    }
    
    // Check file changes
    if (uploadedFile.profile) {
      changes.push({
        field: "Profile Image",
        from: "Current image",
        to: "New uploaded image"
      });
    }
    
    if (uploadedFile.birth) {
      changes.push({
        field: "Birth Certificate",
        from: "Current document",
        to: "New uploaded document"
      });
    }
    
    if (uploadedFile.house) {
      changes.push({
        field: "Household Registration",
        from: "Current document",
        to: "New uploaded document"
      });
    }
    
    return changes;
  };

  // Function to check if there are any changes
  const hasAnyChanges = () => {
    if (!editingChild) return false;
    
    const currentFormData = getValues();
    const changes = detectChanges(editingChild, currentFormData);
    const hasFileUploads = uploadedFile.profile || uploadedFile.birth || uploadedFile.house;
    
    return changes.length > 0 || hasFileUploads;
  };

  // Handle save button click with confirmation
  const handleSaveClick = () => {
    if (!editingChild) return;
    
    const currentFormData = getValues();
    const detectedChanges = detectChanges(editingChild, currentFormData);
    const hasFileUploads = uploadedFile.profile || uploadedFile.birth || uploadedFile.house;
    
    if (detectedChanges.length === 0 && !hasFileUploads) {
      enqueueSnackbar("No changes detected to save.", { variant: "info" });
      return;
    }
    
    setChangesList(detectedChanges);
    setShowSaveConfirmation(true);
  };

  const confirmSave = () => {
    setShowSaveConfirmation(false);
    const formData = getValues();
    onEditSubmit(formData);
  };

  const cancelSave = () => {
    setShowSaveConfirmation(false);
  };

  const onEditSubmit = async (data) => {
    if (!editingChild) return;
    
    if ((editCounts[editingChild.id] || 0) >= MAX_EDIT_TIMES) {
      enqueueSnackbar(
        `You have reached the maximum number of edits (${MAX_EDIT_TIMES}).`,
        { variant: "warning" }
      );
      return;
    }

    // Check for required documents
    const hasProfileImage = uploadedFile.profile || editingChild.profileImage;
    const hasBirthCertificate = uploadedFile.birth || editingChild.birthCertificateImg;
    const hasHouseholdRegistration = uploadedFile.house || editingChild.householdRegistrationImg;

    let hasDocumentErrors = false;
    const newDocumentErrors = { profile: "", birth: "", house: "" };

    if (!hasProfileImage) {
      newDocumentErrors.profile = "Profile image is required";
      hasDocumentErrors = true;
    }
    if (!hasBirthCertificate) {
      newDocumentErrors.birth = "Birth certificate is required";
      hasDocumentErrors = true;
    }
    if (!hasHouseholdRegistration) {
      newDocumentErrors.house = "Household registration is required";
      hasDocumentErrors = true;
    }

    if (hasDocumentErrors) {
      setDocumentErrors(newDocumentErrors);
      enqueueSnackbar("Please upload all required documents", { variant: "error" });
      return;
    }

    try {
      // Validate age
      if (!validateAge(data.dateOfBirth)) {
        setFormError("dateOfBirth", {
          type: "manual",
          message: `Child must be between ${MIN_AGE} and ${MAX_AGE} years old (born between ${minYear} and ${maxYear})`,
        });
        return;
      }

      // Validate total file size before uploading
      const totalSize = calculateTotalFileSize({
        profile: uploadedFile.profile,
        birth: uploadedFile.birth,
        house: uploadedFile.house,
      });

      if (totalSize > MAX_FILE_SIZE_BYTES) {
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        const displayErrorMessage = `Total file size exceeds ${MAX_FILE_SIZE_MB}MB limit (${totalSizeMB}MB/${MAX_FILE_SIZE_MB}MB)`;
        setFileSizeError(displayErrorMessage);
        enqueueSnackbar(displayErrorMessage, { variant: "error" });
        return;
      } else {
        setFileSizeError("");
      }

      setUploading(true);

      // Upload new images if they exist, otherwise keep existing URLs
      let profileImage = editingChild.profileImage;
      let birthCertificateImg = editingChild.birthCertificateImg;
      let householdRegistrationImg = editingChild.householdRegistrationImg;

      if (uploadedFile.profile) {
        profileImage = await uploadToCloudinary(uploadedFile.profile);
      }
      if (uploadedFile.birth) {
        birthCertificateImg = await uploadToCloudinary(uploadedFile.birth);
      }
      if (uploadedFile.house) {
        householdRegistrationImg = await uploadToCloudinary(uploadedFile.house);
      }

      // Auto-capitalize name and place of birth before submitting
      const formattedData = {
        ...editingChild,
        ...data,
        name: capitalizeFirstLetter(data.name),
        placeOfBirth: capitalizeFirstLetter(data.placeOfBirth),
        profileImage,
        birthCertificateImg,
        householdRegistrationImg,
      };

      await updateChild(formattedData);
      
      // Update edit count
      setEditCounts((prev) => ({
        ...prev,
        [editingChild.id]: (prev[editingChild.id] || 0) + 1,
      }));

      // Update children list
      setChildren(prev => {
        const updated = prev.map(child =>
          child.id === editingChild.id ? formattedData : child
        );
        // Sắp xếp lại theo id giảm dần
        return updated.sort((a, b) => b.id - a.id);
      });

      enqueueSnackbar("Child updated successfully!", { variant: "success" });
      closeEditModal();
    } catch (err) {
      // Hiển thị rõ message lỗi từ BE nếu có
      const beMsg = err?.response?.data?.message;
      setFormError("root.serverError", {
        type: "manual",
        message: beMsg || "Failed to update child information. Please try again.",
      });
      enqueueSnackbar(beMsg || "Failed to update child information. Please try again.", { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await getChildren();

        if (response.data) {
          // Sắp xếp id giảm dần
          const sorted = [...response.data].sort((a, b) => b.id - a.id);
          setChildren(sorted);
        } else {
          setChildren([]);
          setError("No child information found");
        }
      } catch (err) {
        console.error("Error fetching child list:", err);
        setError("Error fetching child list information");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

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

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const openDetailModal = (child) => {
    setSelectedChild(child);
    setDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedChild(null);
  };

  // Thêm hàm getGradeByAge nếu chưa có
  const getGradeByAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age === 3) return "SEED";
    if (age === 4) return "BUD";
    if (age === 5) return "LEAF";
    return null;
  };

  // Thêm hàm getGradeColor
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'SEED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'BUD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LEAF':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
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
              className="bg-white rounded-lg border hover:border-blue-300 shadow-sm hover:shadow transition-all relative"
            >
              {/* Icon View (con mắt) ở góc trên bên phải, không chồng lên icon trẻ con */}
              {(!editModalOpen) && (
                <button
                  type="button"
                  className="absolute top-2 right-16 z-20 bg-white rounded-full shadow p-1 hover:bg-blue-50 transition"
                  onClick={() => openDetailModal(child)}
                  title="View Details"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <Visibility style={{ fontSize: 26, color: '#2563eb' }} />
                </button>
              )}
              <div className="flex justify-between items-start">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {child.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {getGenderLabel(child.gender)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Form Status Indicator */}
              <div className="mb-4">
                {child.hadForm ? (
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Form Submitted
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Ready for Enrollment
                    </span>
                  </div>
                )}
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
                onClick={() => handleSelectChild(child)}
              >
                Enroll
              </Button>

              {/* Conditional Edit Button based on admission form status */}
              {(() => {
                // Cho phép edit nếu tất cả form đều là draft/cancelled/rejected
                const hasActiveForm = child.admissionForms && child.admissionForms.some(
                  form => !['draft', 'cancelled', 'rejected'].includes((form.status || '').toLowerCase())
                );
                if (hasActiveForm) {
                  return (
                    <div className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-center">
                      <span className="text-gray-500 text-sm">
                        Cannot edit - Form already submitted
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <Button
                      variant="secondary"
                      className="w-full mb-2"
                      onClick={() => openEditModal(child)}
                      disabled={(editCounts[child.id] || 0) >= MAX_EDIT_TIMES}
                    >
                      Edit
                    </Button>
                  );
                }
              })()}
            </div>
          ))}
        </div>
      )}
      <RenderFormPopUp
        handleClosePopUp={() => setIsPopUpOpen(false)}
        isPopUpOpen={isPopUpOpen}
        students={children}
        GetForm={() => {
          // Refresh children list
          const fetchChildren = async () => {
            try {
              setLoading(true);
              const response = await getChildren();
              if (response.data) {
                // Sắp xếp id giảm dần
                const sorted = [...response.data].sort((a, b) => b.id - a.id);
                setChildren(sorted);
              }
            } catch (err) {
              console.error("Error fetching child list:", err);
            } finally {
              setLoading(false);
            }
          };
          fetchChildren();
        }}
        admissionTerms={admissionTerms}
      />

      {/* Edit Child Modal - Based on AddChildForm design */}
      {editModalOpen && editingChild && (
        <div className="fixed inset-0  overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div 
                className="absolute z-20 bg-gray-500 opacity-75 cursor-pointer" 
                onClick={handleCloseModal}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCloseModal();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Close modal"
              ></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block z-20 align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit(handleSaveClick)} className="bg-white">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Edit Child Information
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Update your child's information
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">
                      Basic Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="edit-name" className="block font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="edit-name"
                          {...register("name", {
                            required: "Child's name is required",
                            onChange: (e) => {
                              handleTextChange(e);
                              handleFormFieldChange(e);
                            },
                          })}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          } focus:outline-none focus:ring-2`}
                          placeholder="Enter child's name"
                        />
                        {errors.name && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="edit-gender" className="block font-medium text-gray-700 mb-1">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="edit-gender"
                          {...register("gender", {
                            required: "Please select gender",
                            onChange: handleFormFieldChange,
                          })}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.gender
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          } focus:outline-none focus:ring-2`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.gender.message}
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="edit-dob" className="block font-medium mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                          <span className="text-sm text-gray-500 ml-2">
                            (Age {MIN_AGE}-{MAX_AGE}, born {minYear}-{maxYear})
                          </span>
                        </label>
                        <input
                          id="edit-dob"
                          type="date"
                          min={minDate}
                          max={maxDate}
                          {...register("dateOfBirth", {
                            required: "Date of birth is required",
                            onChange: handleFormFieldChange,
                            validate: (value) => {
                              if (!validateAge(value)) {
                                return `Child must be between ${MIN_AGE} and ${MAX_AGE} years old (born between ${minYear} and ${maxYear})`;
                              }
                              return true;
                            },
                          })}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.dateOfBirth && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.dateOfBirth.message}
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="edit-pob" className="block font-medium text-gray-700 mb-1">
                          Place of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="edit-pob"
                          {...register("placeOfBirth", {
                            required: "Place of birth is required",
                            onChange: (e) => {
                              handleTextChange(e);
                              handleFormFieldChange(e);
                            },
                          })}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.placeOfBirth
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          } focus:outline-none focus:ring-2`}
                          placeholder="Enter place of birth"
                        />
                        {errors.placeOfBirth && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.placeOfBirth.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File size warning if there's an error */}
                  {fileSizeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{fileSizeError}</p>
                    </div>
                  )}

                  {/* Documents Section */}
                  <div className="space-y-6">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">
                      Documents
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Max {MAX_FILE_SIZE_MB}MB total)
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Profile Image Upload */}
                      <div className="space-y-4">
                        <label className="block font-medium text-gray-700">
                          Profile Image <span className="text-red-500">*</span>
                          {uploadedFile.profile && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({(uploadedFile.profile.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          )}
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                            getBorderColor(uploadedFile.profilePreview, documentErrors.profile)
                          }`}
                        >
                          {uploadedFile.profilePreview ? (
                            <div className="relative">
                              <img
                                key={`profile-${uploadedFile.profile ? 'uploaded' : 'original'}`}
                                src={uploadedFile.profilePreview}
                                alt="Profile Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile("profile");
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 z-10"
                              >
                                ×
                              </button>
                              {/* File input overlay only on image area, not on X button */}
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileChange(e, "profile")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ zIndex: 1 }}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="space-y-2">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload profile image</p>
                              </div>
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileChange(e, "profile")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                        {documentErrors.profile && (
                          <div className="text-red-500 text-sm mt-1">
                            {documentErrors.profile}
                          </div>
                        )}
                      </div>

                      {/* Birth Certificate Upload */}
                      <div className="space-y-4">
                        <label className="block font-medium text-gray-700">
                          Birth Certificate <span className="text-red-500">*</span>
                          {uploadedFile.birth && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({(uploadedFile.birth.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          )}
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                            getBorderColor(uploadedFile.birthPreview, documentErrors.birth)
                          }`}
                        >
                          {uploadedFile.birthPreview ? (
                            <div className="relative">
                              <img
                                key={`birth-${uploadedFile.birth ? 'uploaded' : 'original'}`}
                                src={uploadedFile.birthPreview}
                                alt="Birth Certificate Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile("birth");
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 z-10"
                              >
                                ×
                              </button>
                              {/* File input overlay only on image area, not on X button */}
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileChange(e, "birth")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ zIndex: 1 }}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="space-y-2">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload birth certificate</p>
                              </div>
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileChange(e, "birth")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                        {documentErrors.birth && (
                          <div className="text-red-500 text-sm mt-1">
                            {documentErrors.birth}
                          </div>
                        )}
                      </div>

                      {/* Household Registration Upload */}
                      <div className="space-y-4">
                        <label className="block font-medium text-gray-700">
                          Household Registration <span className="text-red-500">*</span>
                          {uploadedFile.house && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({(uploadedFile.house.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          )}
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                            getBorderColor(uploadedFile.housePreview, documentErrors.house)
                          }`}
                        >
                          {uploadedFile.housePreview ? (
                            <div className="relative">
                              <img
                                key={`house-${uploadedFile.house ? 'uploaded' : 'original'}`}
                                src={uploadedFile.housePreview}
                                alt="Household Registration Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile("house");
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 z-10"
                              >
                                ×
                              </button>
                              {/* File input overlay only on image area, not on X button */}
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileChange(e, "house")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ zIndex: 1 }}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="space-y-2">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload household registration</p>
                              </div>
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileChange(e, "house")}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                        {documentErrors.house && (
                          <div className="text-red-500 text-sm mt-1">
                            {documentErrors.house}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total file size info - only show when there are file changes */}
                  {hasFileChanges && (
                    <div className="text-sm text-gray-500">
                      Total file size: &nbsp;
                      {((uploadedFile.profile?.size || 0) +
                        (uploadedFile.birth?.size || 0) +
                        (uploadedFile.house?.size || 0)) /
                        (1024 * 1024) <
                      MAX_FILE_SIZE_MB ? (
                        <span className="text-green-600 font-medium">
                          {(
                            ((uploadedFile.profile?.size || 0) +
                              (uploadedFile.birth?.size || 0) +
                              (uploadedFile.house?.size || 0)) /
                            (1024 * 1024)
                          ).toFixed(2)}
                          MB / {MAX_FILE_SIZE_MB}MB
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          {(
                            ((uploadedFile.profile?.size || 0) +
                              (uploadedFile.birth?.size || 0) +
                              (uploadedFile.house?.size || 0)) /
                            (1024 * 1024)
                          ).toFixed(2)}
                          MB / {MAX_FILE_SIZE_MB}MB
                        </span>
                      )}
                    </div>
                  )}

                  {errors.root?.serverError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{errors.root.serverError.message}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={
                      isSubmitting || 
                      uploading || 
                      fileSizeError !== "" || 
                      documentErrors.profile !== "" || 
                      documentErrors.birth !== "" || 
                      documentErrors.house !== "" ||
                      !hasAnyChanges() ||
                      !!errors.root?.serverError // disable nếu có lỗi BE
                    }
                    className="flex-1"
                  >
                    {isSubmitting || uploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="sm" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirmation Dialog */}
      {showCloseConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Unsaved Changes
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You have unsaved changes. Are you sure you want to close without saving? All changes will be lost.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={confirmCloseModal}
                  className="w-full sm:w-auto sm:ml-3 bg-red-600 hover:bg-red-700"
                >
                  Yes, Close Without Saving
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelCloseModal}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Dialog */}
      {showSaveConfirmation && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Save Changes
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-3">
                        The following changes will be saved:
                      </p>
                      <div className="bg-gray-50 rounded-md p-3 max-h-60 overflow-y-auto">
                        {changesList.map((change, index) => (
                          <div key={index} className="mb-2 last:mb-0">
                            <div className="text-sm font-medium text-gray-700">
                              {change.field}
                            </div>
                            <div className="text-xs text-gray-500 ml-2">
                              From: <span className="font-mono bg-red-50 px-1 rounded">{change.from || "(empty)"}</span>
                            </div>
                            <div className="text-xs text-gray-500 ml-2">
                              To: <span className="font-mono bg-green-50 px-1 rounded">{change.to || "(empty)"}</span>
                            </div>
                          </div>
                        ))}
                        {(uploadedFile.profile || uploadedFile.birth || uploadedFile.house) && (
                          <div className="text-sm text-gray-600 mt-2 pt-2 border-t">
                            <div className="text-sm font-medium text-gray-700">File Changes:</div>
                            <div className="text-xs text-gray-500 ml-2">
                              New files uploaded for documents
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={confirmSave}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Confirm & Save
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelSave}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Child Details Modal */}
      <Dialog open={detailModalOpen} onClose={closeDetailModal} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle style={{ padding: 0 }}>
          <div className="flex flex-col items-center justify-center pt-8 pb-2">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mb-2 shadow">
              <Baby className="w-12 h-12 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-blue-700">Child Details</span>
          </div>
        </DialogTitle>
        <DialogContent dividers style={{ background: '#f9fafb', padding: '0 0 32px 0', display: 'flex', justifyContent: 'center' }}>
          {selectedChild && (
            <div className="bg-white rounded-2xl shadow-xl px-10 py-8 w-full max-w-lg flex flex-col items-start gap-10">
              <div className="flex flex-col items-start gap-4 w-full">
                <div>
                  <span className="text-sm text-gray-500">Full Name</span><br />
                  <span className="text-xl font-bold text-gray-800">{selectedChild.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Gender</span><br />
                  <span className="text-xl font-semibold text-gray-800">{getGenderLabel(selectedChild.gender)}</span>
                </div>
                <div className="flex flex-row gap-8 w-full">
                  <div>
                    <span className="text-sm text-gray-500">Date of Birth</span><br />
                    <span className="text-xl font-semibold text-gray-800">{selectedChild.dateOfBirth ? new Date(selectedChild.dateOfBirth).toLocaleDateString('vi-VN') : ''}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Grade</span><br />
                    {(() => {
                      const grade = getGradeByAge(selectedChild.dateOfBirth) || 'N/A';
                      return (
                        <span className={`inline-block px-3 py-1 rounded-full border font-bold text-base mt-1 ${getGradeColor(grade)}`}>{grade}</span>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Place of Birth</span><br />
                  <span className="text-xl font-semibold text-gray-800 break-words">{selectedChild.placeOfBirth}</span>
                </div>
              </div>
              <div className="flex flex-row justify-center gap-8 w-full mt-2">
                <div className="flex flex-col items-center bg-gray-50 rounded-xl border shadow-sm p-2 transition-transform hover:scale-105 cursor-pointer" onClick={() => setZoomedImage(selectedChild.profileImage)}>
                  <img src={selectedChild.profileImage} alt="Profile" className="h-32 w-32 object-cover rounded-lg border mb-1 bg-white" />
                  <span className="text-sm text-gray-600 font-medium">Profile Image</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl border shadow-sm p-2 transition-transform hover:scale-105 cursor-pointer" onClick={() => setZoomedImage(selectedChild.birthCertificateImg)}>
                  <img src={selectedChild.birthCertificateImg} alt="Birth Certificate" className="h-32 w-32 object-cover rounded-lg border mb-1 bg-white" />
                  <span className="text-sm text-gray-600 font-medium">Birth Certificate</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl border shadow-sm p-2 transition-transform hover:scale-105 cursor-pointer" onClick={() => setZoomedImage(selectedChild.householdRegistrationImg)}>
                  <img src={selectedChild.householdRegistrationImg} alt="Household Registration" className="h-32 w-32 object-cover rounded-lg border mb-1 bg-white" />
                  <span className="text-sm text-gray-600 font-medium">Household Registration</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={closeDetailModal}>Close</MuiButton>
        </DialogActions>
      </Dialog>
      {/* Lightbox modal phóng to ảnh */}
      {zoomedImage && (
        <Dialog open={!!zoomedImage} onClose={() => setZoomedImage(null)} maxWidth="md" fullWidth>
          <DialogContent style={{ background: '#111827', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <img src={zoomedImage} alt="Zoomed" className="max-h-[70vh] max-w-full rounded-2xl shadow-2xl border-4 border-white" style={{ objectFit: 'contain' }} />
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center', background: '#111827' }}>
            <MuiButton onClick={() => setZoomedImage(null)} style={{ color: 'white' }}>Close</MuiButton>
          </DialogActions>
        </Dialog>
      )}
    </PageTemplate>
  );
};

export default ChildList;

