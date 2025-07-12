import React, {useState} from "react";
import PropTypes from "prop-types";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import authService from "@services/authService";
import {ROUTES} from "@/constants/routes";
import {Spinner} from "../atoms";
import SignUpForm from "../molecules/forms/SignUpForm";
import EmailVerificationForm from "../molecules/forms/EmailVerificationForm";
import {CheckCircle} from "lucide-react";

// Success message component following Atomic Design principles
const SuccessMessage = ({onContinue}) => {
    const {t} = useTranslation("auth");

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
            <div className="w-full max-w-md mx-auto space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <img
                            src="/SUNSHINE.png"
                            alt="Sunshine Preschool"
                            className="h-16 w-auto"
                        />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("register.success")}
                    </h2>

                    <p className="text-sm text-gray-600">
                        {t("register.success")}
                    </p>
                </div>

                {/* Success Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-center space-y-6">
                        <div
                            className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white"/>
                        </div>

                        <div className="space-y-3">
                            <p className="text-gray-600">
                                {t("register.success")}
                            </p>
                            <p className="text-sm text-gray-500">
                                {t("login.redirectInfo.generic")}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Spinner size="md" className="text-green-500"/>
                        </div>

                        <p className="text-sm text-gray-500">
                            {t("register.backToLogin")}{" "}
                            <button
                                onClick={onContinue}
                                className="text-green-600 hover:underline font-medium"
                            >
                                {t("register.signIn")}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    © 2025 Sunshine Preschool. All rights reserved.
                </div>
            </div>
        </div>
    );
};

SuccessMessage.propTypes = {
    onContinue: PropTypes.func.isRequired,
};

// Error Alert component (Atom)
const ErrorAlert = ({message, onDismiss}) => {
    if (!message) return null;

    return (
        <div
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center justify-between">
            <span>{message}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="ml-2 text-red-500 hover:text-red-700"
                >
                    ×
                </button>
            )}
        </div>
    );
};

ErrorAlert.propTypes = {
    message: PropTypes.string,
    onDismiss: PropTypes.func,
};

// SignUp Footer component (Molecule)
const SignUpFooter = () => {
    const {t} = useTranslation("auth");
    return (
        <div className="mt-6 text-center space-y-4">
            <div className="flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
            </div>
            <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                    to={ROUTES.LOGIN}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                    Sign in now
                </Link>
            </p>

            <p className="text-xs text-gray-500 leading-relaxed">
                By creating an account, you agree to our{" "}
                <button className="text-blue-600 hover:underline">
                    Terms of Service
                </button>
                {" "}
                and{" "}
                <button className="text-blue-600 hover:underline">
                    Privacy Policy
                </button>
            </p>
        </div>
    );
};

const SignUp = () => {
    const navigate = useNavigate();
    const {t} = useTranslation("auth");
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Check if we have code and email in URL params
    const code = searchParams.get('code');
    const email = searchParams.get('email');
    const isVerified = Boolean(code && email);

    const handleEmailVerify = async (email) => {
        setSubmitError("");
        setLoading(true);

        try {
            // Request verification code
            await authService.requestVerificationCode(email);
            // Redirect to login page with success message
            navigate(ROUTES.LOGIN, {
                state: {
                    message: t("emailVerification.checkEmail"),
                    email: email
                }
            });
        } catch (error) {
            if (error.response?.data?.message) {
                setSubmitError(error.response.data.message);
            } else if (error.message) {
                setSubmitError(error.message);
            } else {
                setSubmitError(t("register.errors.genericError"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpSubmit = async (formData) => {
        setSubmitError("");
        setLoading(true);

        try {
            // Call the registration API with the code from URL
            await authService.register({
                ...formData,
                code: code
            });
            
            // Show success message
            setShowSuccess(true);

            // Auto redirect to login after 3 seconds
            setTimeout(() => {
                handleContinueToLogin(formData.email);
            }, 3000);
        } catch (error) {
            if (error.response?.data?.message) {
                setSubmitError(error.response.data.message);
            } else if (error.message) {
                setSubmitError(error.message);
            } else {
                setSubmitError(t("register.errors.genericError"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleContinueToLogin = (email) => {
        navigate(ROUTES.LOGIN, {
            state: {
                message: "Registration successful! Please sign in.",
                email: email
            }
        });
    };

    const clearError = () => {
        setSubmitError("");
    };

    // Show success screen if registration was successful
    if (showSuccess) {
        return <SuccessMessage onContinue={() => handleContinueToLogin()} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 px-4">
            <div className="w-full max-w-6xl mx-auto space-y-4">
                {/* Logo and Header - Compact */}
                <div className="text-center">
                    <div className="flex justify-center mb-3">
                        <img
                            src="/SUNSHINE.png"
                            alt="Sunshine Preschool"
                            className="h-12 w-auto"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {isVerified ? t("register.title") : t("emailVerification.title")}
                    </h2>

                    <p className="text-sm text-gray-600">
                        {isVerified ? t("register.subtitle") : t("emailVerification.description")}
                    </p>
                </div>

                {/* Error Alert */}
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        <ErrorAlert
                            message={submitError}
                            onDismiss={clearError}
                        />
                    </div>
                </div>

                {/* Show either email verification form or signup form */}
                {isVerified ? (
                    <>
                        <SignUpForm
                            onSubmit={handleSignUpSubmit}
                            loading={loading}
                        />
                        <div className="flex justify-center">
                            <div className="w-full max-w-md text-center space-y-2">
                                <div className="flex items-center">
                                    <div className="flex-1 border-t border-gray-200"></div>
                                    <span className="px-3 text-gray-500 text-xs">or</span>
                                    <div className="flex-1 border-t border-gray-200"></div>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {t("register.alreadyHaveAccount")}{" "}
                                    <Link
                                        to={ROUTES.LOGIN}
                                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                                    >
                                        {t("register.signIn")}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <EmailVerificationForm
                        onVerify={handleEmailVerify}
                        loading={loading}
                    />
                )}

                {/* Copyright - Smaller */}
                <div className="text-center text-xs text-gray-500">
                    © 2025 Sunshine Preschool. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default SignUp;
