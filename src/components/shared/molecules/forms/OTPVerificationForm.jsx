import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Input, Spinner } from '../../atoms';

const OTPVerificationForm = ({ email, onVerify, loading, resendOTP }) => {
  const { t } = useTranslation('auth');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp.trim()) {
      setError(t('otp.errors.required'));
      return;
    }

    try {
      await onVerify(otp);
    } catch (err) {
      setError(err.message || t('otp.errors.invalid'));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('otp.title')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('otp.description', { email })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t('otp.placeholder')}
            error={error}
            disabled={loading}
            className="w-full"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Spinner size="sm" className="mr-2" />
          ) : null}
          {t('otp.verify')}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={resendOTP}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            disabled={loading}
          >
            {t('otp.resend')}
          </button>
        </div>
      </form>
    </div>
  );
};

OTPVerificationForm.propTypes = {
  email: PropTypes.string.isRequired,
  onVerify: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  resendOTP: PropTypes.func.isRequired,
};

export default OTPVerificationForm;

