import { createChild } from "@api/services/parentService";
import { Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";
import { ArrowLeft, Upload } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MIN_AGE = 3;
const MAX_AGE = 5;
const MAX_FILE_SIZE_MB = 10; // Maximum total file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

const capitalizeFirstLetter = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

//note dong 24_sua lai ham tinh
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

const AddChildForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["parent"]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm();
  const [uploadedFile, setUploadedFile] = useState({
    profile: null,
    birth: null,
    house: null,
    profilePreview: null,
    birthPreview: null,
    housePreview: null,
  });
  const [uploading, setUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState("");

  const { minYear, maxYear } = getValidYearRange();
  const minDate = `${minYear}-01-01`;
  const maxDate = `${maxYear}-12-31`;

  // Format the age range text with proper variable substitution
  const formatAgeRangeText = () => {
    const ageRangeTemplate = t("parent:child_form.labels.age_range");
    return ageRangeTemplate
      .replace("{min}", MIN_AGE)
      .replace("{max}", MAX_AGE)
      .replace("{minYear}", minYear)
      .replace("{maxYear}", maxYear);
  };

  // Calculate total size of all uploaded files
  const calculateTotalFileSize = (files) => {
    let totalSize = 0;
    Object.values(files).forEach((file) => {
      if (file) totalSize += file.size;
    });
    return totalSize;
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        enqueueSnackbar(t("parent:child_form.validation.file_type"), {
          variant: "error",
        });
        return;
      }

      // No need to create a separate object, just calculate the total size directly

      // Calculate the total size of all files
      const totalSize = calculateTotalFileSize({
        profile: type === "profile" ? file : uploadedFile.profile,
        birth: type === "birth" ? file : uploadedFile.birth,
        house: type === "house" ? file : uploadedFile.house,
      });

      // Check if the total file size exceeds the limit
      if (totalSize > MAX_FILE_SIZE_BYTES) {
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        const displayErrorMessage = `${t(
          "parent:child_form.validation.file_size_combined",
          { size: MAX_FILE_SIZE_MB }
        )} (${totalSizeMB}MB/${MAX_FILE_SIZE_MB}MB)`;
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
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-capitalize handler for text inputs
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "placeOfBirth") {
      setValue(name, capitalizeFirstLetter(value));
    }
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

  const onSubmit = async (data) => {
    try {
      // Validate age
      if (!validateAge(data.dateOfBirth)) {
        const invalidAgeTemplate = t(
          "parent:child_form.validation.invalid_age"
        );
        const errorMessage = invalidAgeTemplate
          .replace("{min}", MIN_AGE)
          .replace("{max}", MAX_AGE)
          .replace("{minYear}", minYear)
          .replace("{maxYear}", maxYear);

        setError("dateOfBirth", {
          type: "manual",
          message: errorMessage,
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
        const displayErrorMessage = `${t(
          "parent:child_form.validation.file_size_combined",
          { size: MAX_FILE_SIZE_MB }
        )} (${totalSizeMB}MB/${MAX_FILE_SIZE_MB}MB)`;
        setFileSizeError(displayErrorMessage);
        enqueueSnackbar(displayErrorMessage, { variant: "error" });
        return;
      } else {
        setFileSizeError("");
      }

      setUploading(true);
      const profileImage = uploadedFile.profile
        ? await uploadToCloudinary(uploadedFile.profile)
        : "";
      const birthCertificateImg = uploadedFile.birth
        ? await uploadToCloudinary(uploadedFile.birth)
        : "";
      const householdRegistrationImg = uploadedFile.house
        ? await uploadToCloudinary(uploadedFile.house)
        : "";

      // Auto-capitalize name and place of birth before submitting
      const formattedData = {
        ...data,
        name: capitalizeFirstLetter(data.name),
        placeOfBirth: capitalizeFirstLetter(data.placeOfBirth),
        profileImage,
        birthCertificateImg,
        householdRegistrationImg,
      };

      await createChild(formattedData);
      enqueueSnackbar(t("parent:child_form.success"), { variant: "success" });
      navigate("/user/parent/child-list");
    } catch (err) {
      //       console.error("Child registration error:", err);
      setError("root.serverError", {
        type: "manual",
        message: t("parent:child_form.error"),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTemplate
      title={t("parent:child_form.title")}
      subtitle={t("parent:child_form.subtitle")}
      actions={
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("parent:child_form.back")}
        </Button>
      }
    >
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate("/user/parent/dashboard")}
          className="hover:text-blue-600"
        >
          {t("parent:child_form.breadcrumb.dashboard")}
        </button>
        <span className="mx-2">/</span>
        <button
          onClick={() => navigate("/user/parent/child-list")}
          className="hover:text-blue-600"
        >
          {t("parent:child_form.breadcrumb.children_list")}
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">
          {t("parent:child_form.breadcrumb.add_child")}
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm space-y-6"
      >
        {/* Basic Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {t("parent:child_form.basic_info")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="child-name"
                className="block font-medium text-gray-700 mb-1"
              >
                {t("parent:child_form.labels.full_name")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="child-name"
                {...register("name", {
                  required: t("parent:child_form.validation.required_name"),
                  onChange: handleTextChange,
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
                placeholder={t("parent:child_form.placeholders.enter_name")}
              />
              {errors.name && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="child-gender"
                className="block font-medium text-gray-700 mb-1"
              >
                {t("parent:child_form.labels.gender")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="child-gender"
                {...register("gender", {
                  required: t("parent:child_form.validation.required_gender"),
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
              >
                <option value="">
                  {t("parent:child_form.placeholders.select_gender")}
                </option>
                <option value="male">
                  {t("parent:child_form.gender_options.male")}
                </option>
                <option value="female">
                  {t("parent:child_form.gender_options.female")}
                </option>
              </select>
              {errors.gender && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="child-dob" className="block font-medium mb-1">
                {t("parent:child_form.labels.date_of_birth")}{" "}
                <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({formatAgeRangeText()})
                </span>
              </label>
              <input
                id="child-dob"
                type="date"
                min={minDate}
                max={maxDate}
                {...register("dateOfBirth", {
                  required: t("parent:child_form.validation.required_dob"),
                  validate: (value) => {
                    if (!validateAge(value)) {
                      const invalidAgeTemplate = t(
                        "parent:child_form.validation.invalid_age"
                      );
                      return invalidAgeTemplate
                        .replace("{min}", MIN_AGE)
                        .replace("{max}", MAX_AGE)
                        .replace("{minYear}", minYear)
                        .replace("{maxYear}", maxYear);
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
              <label
                htmlFor="child-pob"
                className="block font-medium text-gray-700 mb-1"
              >
                {t("parent:child_form.labels.place_of_birth")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="child-pob"
                {...register("placeOfBirth", {
                  required: t("parent:child_form.validation.required_pob"),
                  onChange: handleTextChange,
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.placeOfBirth
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
                placeholder={t(
                  "parent:child_form.placeholders.enter_place_of_birth"
                )}
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{fileSizeError}</p>
          </div>
        )}

        {/* Documents Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {t("parent:child_form.required_docs")}
            <span className="text-sm font-normal text-gray-500 ml-2">
              (
              {t("parent:child_form.validation.file_size_label", {
                size: MAX_FILE_SIZE_MB,
              })}
              )
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Image Upload */}
            <div className="space-y-4">
              <label
                htmlFor="profile-image-upload"
                className="block font-medium text-gray-700"
              >
                {t("parent:child_form.labels.profile_image")}{" "}
                <span className="text-red-500">*</span>
                {uploadedFile.profile && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({(uploadedFile.profile.size / (1024 * 1024)).toFixed(2)}{" "}
                    MB)
                  </span>
                )}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                  uploadedFile.profilePreview
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {uploadedFile.profilePreview ? (
                  <div className="relative">
                    <img
                      src={uploadedFile.profilePreview}
                      alt="Profile Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedFile((prev) => ({
                          ...prev,
                          profile: null,
                          profilePreview: null,
                        }))
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {t("parent:child_form.placeholders.profile_upload")}
                    </p>
                  </div>
                )}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={(e) => handleFileChange(e, "profile")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Birth Certificate Upload */}
            <div className="space-y-4">
              <label
                htmlFor="birth-certificate-upload"
                className="block font-medium text-gray-700"
              >
                {t("parent:child_form.labels.birth_certificate")}{" "}
                <span className="text-red-500">*</span>
                {uploadedFile.birth && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({(uploadedFile.birth.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                )}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                  uploadedFile.birthPreview
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {uploadedFile.birthPreview ? (
                  <div className="relative">
                    <img
                      src={uploadedFile.birthPreview}
                      alt="Birth Certificate Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedFile((prev) => ({
                          ...prev,
                          birth: null,
                          birthPreview: null,
                        }))
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {t("parent:child_form.placeholders.birth_upload")}
                    </p>
                  </div>
                )}
                <input
                  id="birth-certificate-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={(e) => handleFileChange(e, "birth")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Household Registration Upload */}
            <div className="space-y-4">
              <label
                htmlFor="household-registration-upload"
                className="block font-medium text-gray-700"
              >
                {t("parent:child_form.labels.household_registration")}{" "}
                <span className="text-red-500">*</span>
                {uploadedFile.house && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({(uploadedFile.house.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                )}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                  uploadedFile.housePreview
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {uploadedFile.housePreview ? (
                  <div className="relative">
                    <img
                      src={uploadedFile.housePreview}
                      alt="Household Registration Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedFile((prev) => ({
                          ...prev,
                          house: null,
                          housePreview: null,
                        }))
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {t("parent:child_form.placeholders.household_upload")}
                    </p>
                  </div>
                )}
                <input
                  id="household-registration-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={(e) => handleFileChange(e, "house")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {errors.root?.serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{errors.root.serverError.message}</p>
          </div>
        )}

        {/* Add a reminder about required fields */}
        <div className="text-sm text-gray-500 pt-2">
          <span className="text-red-500">*</span>{" "}
          {t("validation.required", { ns: "form" })}
        </div>

        {/* Total file size info */}
        <div className="text-sm text-gray-500 pt-2">
          {t("parent:child_form.validation.file_size_label", {
            size: MAX_FILE_SIZE_MB,
          })}
          :&nbsp;
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

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            {t("parent:child_form.buttons.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || uploading || fileSizeError !== ""}
            className="flex-1"
          >
            {isSubmitting || uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>{t("parent:child_form.buttons.registering")}</span>
              </div>
            ) : (
              t("parent:child_form.buttons.register")
            )}
          </Button>
        </div>
      </form>
    </PageTemplate>
  );
};

export default AddChildForm;
