import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";
import  {createChild} from "@api/services/parentService";


const AddChildForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const [uploadedFile, setUploadedFile] = useState({
    profile: null,
    birth: null,
    house: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e, type) => {
    setUploadedFile({ ...uploadedFile, [type]: e.target.files[0] });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pes_swd");
    formData.append("api_key", "837117616828593");
    const res = await fetch("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      // Upload images if selected
      const profileImage = uploadedFile.profile ? await uploadToCloudinary(uploadedFile.profile) : "";
      const birthCertificateImg = uploadedFile.birth ? await uploadToCloudinary(uploadedFile.birth) : "";
      const householdRegistrationImg = uploadedFile.house ? await uploadToCloudinary(uploadedFile.house) : "";
      await createChild({
        ...data,
        profileImage,
        birthCertificateImg,
        householdRegistrationImg,
      });
      navigate("/user/parent/child-list");
    } catch (err) {
      setError("root.serverError", { type: "manual", message: "Registration failed. Please check your information." });
    } finally {
      setUploading(false);
    }
  };
  return (
    <PageTemplate title="Register Child Information">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label htmlFor="child-name" className="block font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
          <input
            id="child-name"
            {...register("name", { required: "Please enter the full name" })}
            className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
        </div>
        <div>
          <label htmlFor="child-gender" className="block font-medium mb-1">Gender <span className="text-red-500">*</span></label>
          <select
            id="child-gender"
            {...register("gender", { required: "Please select a gender" })}
            className={`input input-bordered w-full ${errors.gender ? 'border-red-500' : ''}`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <div className="text-red-500 text-xs mt-1">{errors.gender.message}</div>}
        </div>
        <div>
          <label htmlFor="child-dob" className="block font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
          <input
            id="child-dob"
            type="date"
            {...register("dateOfBirth", { required: "Please select a date of birth" })}
            className={`input input-bordered w-full ${errors.dateOfBirth ? 'border-red-500' : ''}`}
          />
          {errors.dateOfBirth && <div className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</div>}
        </div>
        <div>
          <label htmlFor="child-pob" className="block font-medium mb-1">Place of Birth <span className="text-red-500">*</span></label>
          <input
            id="child-pob"
            {...register("placeOfBirth", { required: "Please enter the place of birth" })}
            className={`input input-bordered w-full ${errors.placeOfBirth ? 'border-red-500' : ''}`}
          />
          {errors.placeOfBirth && <div className="text-red-500 text-xs mt-1">{errors.placeOfBirth.message}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">Profile Image <span className="text-red-500">*</span></label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, "profile")}/>
          {uploadedFile.profile && <span className="text-xs text-gray-600 ml-2">{uploadedFile.profile.name}</span>}
        </div>
        <div>
          <label className="block font-medium mb-1">Birth Certificate <span className="text-red-500">*</span></label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, "birth")}/>
          {uploadedFile.birth && <span className="text-xs text-gray-600 ml-2">{uploadedFile.birth.name}</span>}
        </div>
        <div>
          <label className="block font-medium mb-1">Household Registration <span className="text-red-500">*</span></label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, "house")}/>
          {uploadedFile.house && <span className="text-xs text-gray-600 ml-2">{uploadedFile.house.name}</span>}
        </div>
        {errors.root?.serverError && <div className="text-red-500 text-sm">{errors.root.serverError.message}</div>}
        <Button type="submit" variant="primary" disabled={isSubmitting || uploading} className="w-full">
          {(isSubmitting || uploading) ? <Spinner size="sm" /> : "Register"}
        </Button>
      </form>
    </PageTemplate>
  );
};

export default AddChildForm;
