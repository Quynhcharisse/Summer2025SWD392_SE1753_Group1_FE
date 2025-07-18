import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Input, Button, Spinner } from '../../atoms';

const EmailVerificationForm = ({ onVerify, loading }) => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError(t('form.errors.emailRequired'));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('form.errors.emailInvalid'));
      return;
    }

    try {
      await onVerify(email);
    } catch (err) {
      setError(err.message || t('form.errors.genericError'));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card with Glass Morphism */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-6 transform hover:scale-105 transition-all duration-300">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <img
              src="/SUNSHINE.png"
              alt="Sunshine Preschool"
              className="h-12 w-auto drop-shadow-lg"
            />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800">
            {t('emailVerification.title')}
          </h3>
          
          <p className="text-gray-600 text-base">
            {t('emailVerification.description')}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg text-base font-medium transition-all duration-200 
                  ${error 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-purple-200'
                  } 
                  focus:outline-none focus:ring-4 focus:ring-opacity-50 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:border-purple-300 hover:bg-white
                  placeholder:text-gray-400`}
              />
              
              {loading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Spinner size="sm" className="text-purple-500" />
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg text-base 
              hover:from-purple-700 hover:to-blue-700 
              focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 transition-all duration-200 
              shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Verification Code
              </div>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            We'll send a verification code to your email address
          </p>
          <p className="text-xs text-gray-400">
            Please check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
};

EmailVerificationForm.propTypes = {
  onVerify: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default EmailVerificationForm; 