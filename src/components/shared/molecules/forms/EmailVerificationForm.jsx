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
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('form.email')}
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
          {t('emailVerification.verify')}
        </Button>
      </form>
    </div>
  );
};

EmailVerificationForm.propTypes = {
  onVerify: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default EmailVerificationForm; 