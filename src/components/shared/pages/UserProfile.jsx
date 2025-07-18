import { getDashboardRoute } from "@/constants/routes";
import { Button, Input, Label, Spinner } from "@atoms";
import { authService } from "@services/authService";
import { getCurrentTokenData } from "@services/JWTService";
import { PageTemplate } from "@templates";
import {
  AlertCircle,
  Calendar,
  Edit2,
  Key,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Validation rules
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
    message: {
      required: "Full name is required",
      minLength: "Full name must be at least 2 characters",
      maxLength: "Full name cannot exceed 50 characters",
      pattern: "Full name can only contain letters and spaces",
    },
  },
  phone: {
    required: true,
    pattern: /^[0-9]{10}$/,
    message: {
      required: "Phone number is required",
      pattern: "Phone number must be 10 digits",
    },
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200,
    message: {
      required: "Address is required",
      minLength: "Address must be at least 10 characters",
      maxLength: "Address cannot exceed 200 characters",
    },
  },
  gender: {
    required: true,
    message: {
      required: "Please select a gender",
    },
  },
};

const UserProfile = () => {
  //   console.log("🔍 UserProfile component rendered");
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "",
  });

  // Password reset form
  const [passwordData, setPasswordData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    //     console.log("🔄 UserProfile useEffect triggered, calling loadProfile");
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.getUserProfile();
      //       console.log("📋 Profile response:", response);

      // Extract actual data from response
      const profileData = response.data || response;
      //       console.log("📋 Profile data extracted:", profileData);
      //       console.log("📋 Setting profile state with:", profileData);
      setProfile(profileData);

      // Check if this is first login (profile incomplete or password needs reset)
      const needsPasswordReset =
        profileData.firstLogin || profileData.tempPassword;
      setIsFirstLogin(needsPasswordReset);
      setShowPasswordReset(needsPasswordReset);

      // Set form data with name field directly
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        gender: profileData.gender || "",
      });

      setPasswordData((prev) => ({
        ...prev,
        email: profileData.email || "",
      }));

      //       console.log("✅ Profile loaded successfully, final state:", {
    } catch (error) {
      //       console.error("❌ Failed to load profile:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      //       console.log("🏁 loadProfile finished, setting loading to false");
      setLoading(false);
    }
  };

  // Validation function
  const validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return "";

    if (rules.required && !value) {
      return rules.message.required;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return rules.message.minLength;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message.maxLength;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message.pattern;
    }

    return "";
  };

  // Handle form change with validation
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate all fields before saving
  const validateForm = () => {
    const errors = {};
    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      setError("Please check your information");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await authService.updateUserProfile(formData);
      setSuccess("Profile updated successfully!");
      setEditing(false);
      await loadProfile();
    } catch (error) {
      //       console.error("Failed to update profile:", error);
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      // Validate passwords
      if (passwordData.password !== passwordData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      if (passwordData.password.length < 6) {
        setError("Password must be at least 6 characters!");
        return;
      }

      setSaving(true);
      setError("");

      await authService.resetPassword({
        email: passwordData.email,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword,
      });

      setSuccess("Password changed successfully!");
      setShowPasswordReset(false);
      setIsFirstLogin(false);
    } catch (error) {
      //       console.error("Password reset failed:", error);
      setError("Password reset failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleContinueToDashboard = () => {
    const tokenData = getCurrentTokenData();
    const dashboardRoute = getDashboardRoute(tokenData?.role);
    navigate(dashboardRoute);
  };

  //   console.log("🎭 Render state:", { loading, profile, formData, error });

  if (loading) {
    //     console.log("⏳ Showing loading state");
    return (
      <PageTemplate title="Personal Information">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading information...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Personal Information"
      subtitle={
        isFirstLogin
          ? "Please update your information and change your password"
          : "Manage your account information"
      }
      actions={
        !isFirstLogin && (
          <div className="flex gap-3">
            {!editing ? (
              <Button
                variant="outline"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile?.name || "",
                      phone: profile?.phone || "",
                      address: profile?.address || "",
                      gender: profile?.gender || "",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  loading={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setShowPasswordReset(true)}
              className="flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* First Login Alert */}
        {isFirstLogin && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  First Time Login
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Please update your personal information and change your
                  password to complete account setup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-3 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Change Password
              </h3>
              {!isFirstLogin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordReset(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={passwordData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter again"
                />
              </div>

              <Button
                variant="primary"
                onClick={handlePasswordReset}
                loading={saving}
                className="w-full"
              >
                Change Password
              </Button>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name - Editable */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                {editing ? (
                  <div>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {formData.name || profile?.name || "Not updated"}
                    </span>
                  </div>
                )}
              </div>

              {/* Email - Read Only */}
              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{profile?.email}</span>
                </div>
              </div>

              {/* Role - Read Only */}
              <div>
                <Label>Role</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{profile?.role}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                {editing ? (
                  <div>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      className={`w-full p-2 border rounded-md ${
                        formErrors.gender ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {formErrors.gender && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.gender}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {(formData.gender || profile?.gender) === "male"
                        ? "Male"
                        : (formData.gender || profile?.gender) === "female"
                        ? "Female"
                        : (formData.gender || profile?.gender) === "other"
                        ? "Other"
                        : "Not updated"}
                    </span>
                  </div>
                )}
              </div>

              {/* Phone - Editable */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editing ? (
                  <div>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="Enter your phone number"
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {formData.phone || profile?.phone || "Not updated"}
                    </span>
                  </div>
                )}
              </div>

              {/* Created Date - Read Only */}
              <div>
                <Label>Created Date</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US")
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Address - Editable */}
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                {editing ? (
                  <div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      placeholder="Enter your address"
                      className={`w-full p-2 border rounded-md ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500`}
                      rows={3}
                    />
                    {formErrors.address && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.address}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-900">
                      {formData.address || profile?.address || "Not updated"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button for First Login */}
        {isFirstLogin && !showPasswordReset && (
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinueToDashboard}
              className="min-w-[200px]"
            >
              Continue to Dashboard
            </Button>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default UserProfile;
