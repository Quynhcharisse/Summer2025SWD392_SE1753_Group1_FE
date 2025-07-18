import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Button, Spinner } from '../../atoms';

const SignUpForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation('auth');

  // Validation schema using Yup with translations
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('register.errors.nameRequired'))
      .matches(/^[a-zA-Z\s'-]+$/, t('register.errors.nameFormat'))
      .min(2, t('register.errors.nameLength'))
      .max(50, t('register.errors.nameLength')),

    phone: yup
      .string()
      .required(t('register.errors.phoneRequired'))
      .matches(/^(03|05|07|08|09)\d{8}$/, t('register.errors.phoneFormat')),

    gender: yup
      .string()
      .required(t('register.errors.genderRequired'))
      .oneOf(['male', 'female'], t('register.errors.genderInvalid')),

    identityNumber: yup
      .string()
      .required(t('register.errors.identityRequired'))
      .matches(/^\d{12}$/, t('register.errors.identityFormat')),

    job: yup
      .string()
      .required(t('register.errors.jobRequired'))
      .max(100, t('register.errors.jobLength')),

    relationshipToChild: yup
      .string()
      .required(t('register.errors.relationshipRequired'))
      .matches(/^(father|mother)$/i, t('register.errors.relationshipInvalid')),

    password: yup
      .string()
      .required(t('register.errors.passwordRequired'))
      .min(8, t('register.errors.passwordLength'))
      .matches(/\d/, t('register.errors.passwordDigit'))
      .matches(/[a-z]/, t('register.errors.passwordLower'))
      .matches(/[A-Z]/, t('register.errors.passwordUpper'))
      .matches(/[^A-Za-z0-9]/, t('register.errors.passwordSpecial')),

    confirmPassword: yup
      .string()
      .required(t('register.errors.confirmRequired'))
      .oneOf([yup.ref('password')], t('register.errors.confirmMismatch'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur' // Validate on blur for better UX
  });

  const onSubmitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header with Logo and Title */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            {/* Glow effect background */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-110"></div>
            {/* Logo with enhanced styling */}
            <img
              src="/SUNSHINE.png"
              alt="Sunshine Preschool"
              className="h-20 w-auto relative z-10 drop-shadow-2xl filter brightness-110 contrast-110 hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {t('register.title')}
          </h2>
          <p className="text-white/80 text-base">
            {t('register.subtitle')}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmitHandler)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="space-y-4">
        {/* Name Field */}
        <div>
          <Input
            {...register('name')}
            type="text"
            placeholder={t('register.form.name')}
            error={!!errors.name}
            errorMessage={errors.name?.message}
            disabled={loading}
          />
        </div>

        {/* Phone Field */}
        <div>
          <Input
            {...register('phone')}
            type="tel"
            placeholder={t('register.form.phone')}
            error={!!errors.phone}
            errorMessage={errors.phone?.message}
            disabled={loading}
          />
        </div>

        {/* Gender Field */}
        <div>
          <select
            {...register('gender')}
            className={`w-full p-2 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          >
            <option value="">{t('register.form.selectGender')}</option>
            <option value="male">{t('register.form.male')}</option>
            <option value="female">{t('register.form.female')}</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Identity Number Field */}
        <div>
          <Input
            {...register('identityNumber')}
            type="text"
            placeholder={t('register.form.identityNumber')}
            error={!!errors.identityNumber}
            errorMessage={errors.identityNumber?.message}
            disabled={loading}
          />
        </div>

        {/* Job Field */}
        <div>
          <Input
            {...register('job')}
            type="text"
            placeholder={t('register.form.job')}
            error={!!errors.job}
            errorMessage={errors.job?.message}
            disabled={loading}
          />
        </div>

        {/* Relationship to Child Field */}
        <div>
          <select
            {...register('relationshipToChild')}
            className={`w-full p-2 border rounded-md ${errors.relationshipToChild ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          >
            <option value="">{t('register.form.selectRelationship')}</option>
            <option value="father">{t('register.form.father')}</option>
            <option value="mother">{t('register.form.mother')}</option>
          </select>
          {errors.relationshipToChild && (
            <p className="mt-1 text-sm text-red-600">{errors.relationshipToChild.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Input
            {...register('password')}
            type="password"
            placeholder={t('register.password')}
            error={!!errors.password}
            errorMessage={errors.password?.message}
            disabled={loading}
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder={t('register.confirmPassword')}
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            disabled={loading}
          />
        </div>
      </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {t('register.form.submitting')}
            </>
          ) : (
            t('register.form.submit')
          )}
        </Button>
      </form>
    </div>
  );
};

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default SignUpForm;
