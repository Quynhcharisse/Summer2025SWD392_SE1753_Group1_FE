import React, {useState} from "react";
import PropTypes from "prop-types";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {authService} from "@/api/services/authService";
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
            className="min-h-screen flex items-center justify-center py-8 px-4"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
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
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center space-y-6">
                        <div
                            className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <CheckCircle className="w-12 h-12 text-white drop-shadow-lg"/>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-700 text-lg font-medium">
                                {t("register.success")}
                            </p>
                            <p className="text-gray-600">
                                {t("login.redirectInfo.generic")}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-md opacity-30 animate-ping"></div>
                                <Spinner size="md" className="text-green-500 relative z-10"/>
                            </div>
                        </div>

                        <p className="text-gray-600">
                            {t("register.backToLogin")}{" "}
                            <button
                                onClick={onContinue}
                                className="text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors duration-200 hover:scale-105 transform inline-block"
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
            className="mb-4 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between shadow-lg transform hover:scale-105 transition-all duration-200">
            <span className="font-medium">{message}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200"
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
    const [registeredEmail, setRegisteredEmail] = useState("");

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
                email: email, // Use email from URL params
                code: code
            });
            
            // Save email for success message
            setRegisteredEmail(email);
            
            // Show success message
            setShowSuccess(true);

            // Auto redirect to login after 3 seconds
            setTimeout(() => {
                console.log("🔍 SignUp - Auto redirect timeout triggered");
                handleContinueToLogin(email);
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
        return <SuccessMessage onContinue={() => handleContinueToLogin(registeredEmail || email)} />;
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center py-4 px-4"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
            <div className="w-full max-w-6xl mx-auto space-y-4">


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
                            <div className="w-full max-w-md text-center space-y-3">
                                <div className="flex items-center">
                                    <div className="flex-1 border-t border-white/30"></div>
                                    <span className="px-4 text-white/70 text-sm font-medium">or</span>
                                    <div className="flex-1 border-t border-white/30"></div>
                                </div>
                                <p className="text-white/90 text-base">
                                    {t("register.haveAccount")}{" "}
                                    <Link
                                        to={ROUTES.LOGIN}
                                        className="text-white font-bold hover:text-white/80 hover:underline transition-all duration-200 hover:scale-105 transform inline-block drop-shadow-md"
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
                <div className="text-center text-sm text-white/60 drop-shadow-md">
                    © 2025 Sunshine Preschool. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default SignUp;
