import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTemplate } from "@templates";
import { Button, Spinner } from "@atoms";
import EnrollmentForm from "../molecules/forms/EnrollmentForm";
import { enrollmentService } from "../../../api/services/enrollmentService";
import { isAuthenticated } from "@services/JWTService.jsx";
import { CheckCircle, FileText, AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";

// Success Message Component
const EnrollmentSuccess = ({ applicationData, onContinue }) => (
  <AuthTemplate
    title="Enrollment Successful!"
    subtitle="Your enrollment application has been submitted successfully"
  >
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>

      <div className="space-y-3">
        <p className="text-gray-600">
          Thank you for submitting the enrollment application for{" "}
          <strong>{applicationData?.childName}</strong>!
        </p>
        <p className="text-sm text-gray-500">
          Application ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {applicationData?.applicationId}
          </span>
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
        <div className="flex">
          <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Next steps:</h4>
            <p className="text-sm text-blue-700 mt-1">
              We will contact you within 2-3 business days to guide you on
              document submission and interview schedule.
            </p>
            <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
              <li>Check your email for detailed information</li>
              <li>Prepare necessary documents</li>
              <li>Wait for the interview appointment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={onContinue}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Manage Applications
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Back to Home
        </Button>
      </div>
    </div>
  </AuthTemplate>
);

EnrollmentSuccess.propTypes = {
  applicationData: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
};

// Login Required Message
const LoginRequired = ({ onLogin }) => (
  <AuthTemplate
    title="Login Required"
    subtitle="You need to log in to continue with the enrollment application"
  >
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-white" />
      </div>

      <div className="space-y-3">
        <p className="text-gray-600">
          To ensure accurate information and security, you need an account to apply for enrollment.
        </p>
        <p className="text-sm text-gray-500">
          If you don't have an account yet, you can register for free.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
        <div className="flex">
          <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              Why login is required?
            </h4>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Track application status</li>
              <li>Receive updates via email</li>
              <li>Manage information and documents</li>
              <li>Contact the school directly</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="primary" onClick={onLogin}>
          Login
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/signup")}
        >
          Create Account
        </Button>
      </div>
    </div>
  </AuthTemplate>
);

LoginRequired.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

const EnrollmentApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      try {
        const authenticated = isAuthenticated();
        setIsUserAuthenticated(authenticated);

        if (authenticated) {
        }
      } catch (error) {
        setIsUserAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitError("");
    setLoading(true);

    try {
      // Prepare enrollment data
      const enrollmentData = {
        // Child information
        child: {
          firstName: formData.childFirstName,
          lastName: formData.childLastName,
          dateOfBirth: formData.childDateOfBirth,
          gender: formData.childGender,
          address: formData.childAddress,
        },
        // Parent/Guardian information
        parent: {
          firstName: formData.parentFirstName,
          lastName: formData.parentLastName,
          relationship: formData.relationship,
          phone: formData.parentPhone,
          email: formData.parentEmail,
          idNumber: formData.parentIdNumber,
          address: formData.parentAddress,
        },
        // Program selection
        program: formData.program,
        // Additional data
        applicationDate: new Date().toISOString(),
        status: "SUBMITTED",
      };

      const response = await enrollmentService.submitEnrollmentApplication(
        enrollmentData
      );

      // Set success data
      setApplicationData({
        applicationId: response.applicationId || "ENR-" + Date.now(),
        childName: `${formData.childFirstName} ${formData.childLastName}`,
        program: formData.program,
        parentEmail: formData.parentEmail,
      });

      setShowSuccess(true);
    } catch (error) {
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Failed to submit application. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Redirect to login with return URL
    navigate("/auth/login", {
      state: {
        returnUrl: "/user/parent/add-child",
        message: "Please log in to continue with the enrollment application.",
      },
    });
  };

  const handleManageApplications = () => {
    navigate("/user/parent/forms");
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <AuthTemplate title="Checking...">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Checking login status...</p>
        </div>
      </AuthTemplate>
    );
  }

  // Show login required if user is not authenticated
  if (!isUserAuthenticated) {
    return <LoginRequired onLogin={handleLogin} />;
  }

  // Show success screen if application was submitted
  if (showSuccess) {
    return (
      <EnrollmentSuccess
        applicationData={applicationData}
        onContinue={handleManageApplications}
      />
    );
  }

  // Main enrollment application form
  return (
    <AuthTemplate
      title="Enrollment Application"
      subtitle="Please fill in all information to register your child for admission"
      showLogo={false}
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center justify-between">
            <span>{submitError}</span>
            <button
              onClick={() => setSubmitError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Enrollment Form */}
        <EnrollmentForm
          onSubmit={handleSubmit}
          loading={loading}
          className="bg-white rounded-lg p-6 shadow-sm"
        />

        {/* Help Information */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>
            Need help? Contact:{" "}
            <a href="tel:1900-1234" className="text-blue-600 hover:underline">
              1900-1234
            </a>{" "}
            or{" "}
            <a
              href="mailto:admissions@sunshinepreschool.com"
              className="text-blue-600 hover:underline"
            >
              admissions@sunshinepreschool.com
            </a>
          </p>
        </div>
      </div>
    </AuthTemplate>
  );
};

export default EnrollmentApplication;
