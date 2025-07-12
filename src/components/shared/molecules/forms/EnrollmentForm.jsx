import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Button, Input, InputSelect, Spinner } from "@atoms";
import {
  User,
  Baby,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Users,
  Heart,
  AlertCircle,
  FileText,
  CreditCard,
  Upload,
  File,
  CheckCircle,
  X
} from "lucide-react";
import { RELATIONSHIPS, PROGRAMS, ENROLLMENT_REQUIREMENTS, DOCUMENT_TYPES } from "../../../../constants/enrollment";

// Error Message Component
const ErrorMessage = ({ error }) =>
  error ? (
    <p className="text-red-500 text-xs flex items-center mt-1 bg-red-50 rounded-md px-2 py-1">
      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
      {error.message}
    </p>
  ) : null;

ErrorMessage.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
};

// Input with Icon Component
const InputWithIcon = ({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  register,
  rules,
  error,
  disabled,
  className = "",
}) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type={type}
          {...register(name, rules)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 ${className}`}
          error={!!error}
        />
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

InputWithIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

// Document Upload Component
const DocumentUpload = ({ 
  documentType, 
  title, 
  description, 
  required = false, 
  uploadedFiles, 
  onFileUpload, 
  onFileRemove,
  disabled = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    if (disabled) return;
    
    const validFiles = files.filter(file => {
      const isValidType = ['image/*', 'application/pdf', '.doc', '.docx'].some(type => 
        file.type.match(type.replace('*', '.*'))
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      onFileUpload(documentType, validFiles);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const currentFiles = uploadedFiles[documentType] || [];

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center ml-4">
          {currentFiles.length > 0 && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>

      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-400'}
          ${currentFiles.length > 0 ? 'bg-green-50 border-green-300' : ''}
        `}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          {currentFiles.length > 0 
            ? `${currentFiles.length} tệp đã tải lên` 
            : 'Kéo thả tệp vào đây hoặc nhấp để chọn tệp'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 5MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Uploaded Files List */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Tệp đã tải lên:</h5>
          {currentFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center">
                <File className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(documentType, index);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DocumentUpload.propTypes = {
  documentType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  required: PropTypes.bool,
  uploadedFiles: PropTypes.object.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onFileRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

const EnrollmentForm = ({ onSubmit, loading = false, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const isFormDisabled = loading || isSubmitting;

  const nextStep = async () => {
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['childFirstName', 'childLastName', 'childDateOfBirth', 'childGender', 'program'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['parentFirstName', 'parentLastName', 'relationship', 'parentPhone', 'parentEmail'];
    } else if (currentStep === 3) {
      fieldsToValidate = Object.keys(ENROLLMENT_REQUIREMENTS).flatMap(key => {
        return ENROLLMENT_REQUIREMENTS[key].documents.map(doc => `${key}_${doc.type}`);
      });
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = (formData) => {
//     console.log('📝 EnrollmentForm onSubmit called with:', formData);
    onSubmit(formData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
              step <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepTitle = () => {
    const titles = {
      1: "Thông tin trẻ em",
      2: "Thông tin phụ huynh/người giám hộ", 
      3: "Tải lên tài liệu",
      4: "Xác nhận thông tin"
    };
    return (
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
        {titles[currentStep]}
      </h3>
    );
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {renderStepIndicator()}
      {renderStepTitle()}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Step 1: Child Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithIcon
                icon={User}
                name="childFirstName"
                placeholder="Tên của trẻ *"
                register={register}
                rules={{
                  required: "Tên của trẻ không được để trống",
                  minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" }
                }}
                error={errors.childFirstName}
                disabled={isFormDisabled}
              />

              <InputWithIcon
                icon={User}
                name="childLastName"
                placeholder="Họ của trẻ *"
                register={register}
                rules={{
                  required: "Họ của trẻ không được để trống",
                  minLength: { value: 2, message: "Họ phải có ít nhất 2 ký tự" }
                }}
                error={errors.childLastName}
                disabled={isFormDisabled}
              />
            </div>

            <InputWithIcon
              icon={Calendar}
              type="date"
              name="childDateOfBirth"
              placeholder="Ngày sinh của trẻ *"
              register={register}
              rules={{
                required: "Ngày sinh không được để trống",
                validate: (value) => {
                  const birthDate = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  if (age < 1 || age > 6) {
                    return "Trẻ phải từ 1-6 tuổi";
                  }
                  return true;
                }
              }}
              error={errors.childDateOfBirth}
              disabled={isFormDisabled}
            />

            <div className="space-y-1">
              <InputSelect
                name="childGender"
                {...register("childGender", { 
                  required: "Vui lòng chọn giới tính" 
                })}
                value={watch("childGender") || ""}
                options={[
                  { value: "", label: "Chọn giới tính của trẻ *" },
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                ]}
                error={!!errors.childGender}
                disabled={isFormDisabled}
                icon={Baby}
              />
              <ErrorMessage error={errors.childGender} />
            </div>

            <div className="space-y-1">
              <InputSelect
                name="program"
                {...register("program", { 
                  required: "Vui lòng chọn chương trình học" 
                })}
                value={watch("program") || ""}
                options={[
                  { value: "", label: "Chọn chương trình học *" },
                  { value: PROGRAMS.TODDLER, label: "Toddler Program (18 tháng - 2 tuổi)" },
                  { value: PROGRAMS.PRESCHOOL, label: "Preschool Program (3 - 4 tuổi)" },
                  { value: PROGRAMS.PRE_K, label: "Pre-K Program (4 - 5 tuổi)" },
                ]}
                error={!!errors.program}
                disabled={isFormDisabled}
                icon={FileText}
              />
              <ErrorMessage error={errors.program} />
            </div>

            <InputWithIcon
              icon={MapPin}
              name="childAddress"
              placeholder="Địa chỉ hiện tại của trẻ"
              register={register}
              rules={{
                required: "Địa chỉ không được để trống",
                minLength: { value: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" }
              }}
              error={errors.childAddress}
              disabled={isFormDisabled}
            />
          </div>
        )}

        {/* Step 2: Parent/Guardian Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithIcon
                icon={User}
                name="parentFirstName"
                placeholder="Tên phụ huynh/người giám hộ *"
                register={register}
                rules={{
                  required: "Tên không được để trống",
                  minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" }
                }}
                error={errors.parentFirstName}
                disabled={isFormDisabled}
              />

              <InputWithIcon
                icon={User}
                name="parentLastName"
                placeholder="Họ phụ huynh/người giám hộ *"
                register={register}
                rules={{
                  required: "Họ không được để trống",
                  minLength: { value: 2, message: "Họ phải có ít nhất 2 ký tự" }
                }}
                error={errors.parentLastName}
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-1">
              <InputSelect
                name="relationship"
                {...register("relationship", { 
                  required: "Vui lòng chọn mối quan hệ" 
                })}
                value={watch("relationship") || ""}
                options={[
                  { value: "", label: "Mối quan hệ với trẻ *" },
                  { value: RELATIONSHIPS.MOTHER, label: "Mẹ" },
                  { value: RELATIONSHIPS.FATHER, label: "Bố" },
                  { value: RELATIONSHIPS.GUARDIAN, label: "Người giám hộ" },
                  { value: RELATIONSHIPS.GRANDPARENT, label: "Ông/Bà" },
                  { value: RELATIONSHIPS.OTHER, label: "Khác" },
                ]}
                error={!!errors.relationship}
                disabled={isFormDisabled}
                icon={Heart}
              />
              <ErrorMessage error={errors.relationship} />
            </div>

            <InputWithIcon
              icon={Phone}
              name="parentPhone"
              placeholder="Số điện thoại liên hệ *"
              register={register}
              rules={{
                required: "Số điện thoại không được để trống",
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Số điện thoại không hợp lệ"
                }
              }}
              error={errors.parentPhone}
              disabled={isFormDisabled}
            />

            <InputWithIcon
              icon={Mail}
              type="email"
              name="parentEmail"
              placeholder="Email liên hệ *"
              register={register}
              rules={{
                required: "Email không được để trống",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ"
                }
              }}
              error={errors.parentEmail}
              disabled={isFormDisabled}
            />

            <InputWithIcon
              icon={CreditCard}
              name="parentIdNumber"
              placeholder="Số CMND/CCCD của phụ huynh *"
              register={register}
              rules={{
                required: "Số CMND/CCCD không được để trống",
                pattern: {
                  value: /^\d{9,12}$/,
                  message: "Số CMND/CCCD phải có 9-12 chữ số"
                }
              }}
              error={errors.parentIdNumber}
              disabled={isFormDisabled}
            />

            <InputWithIcon
              icon={MapPin}
              name="parentAddress"
              placeholder="Địa chỉ của phụ huynh/người giám hộ"
              register={register}
              rules={{
                required: "Địa chỉ không được để trống",
                minLength: { value: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" }
              }}
              error={errors.parentAddress}
              disabled={isFormDisabled}
            />
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {Object.keys(ENROLLMENT_REQUIREMENTS).map((key) => (
              <DocumentUpload
                key={key}
                documentType={key}
                title={ENROLLMENT_REQUIREMENTS[key].title}
                description={ENROLLMENT_REQUIREMENTS[key].description}
                required={ENROLLMENT_REQUIREMENTS[key].required}
                uploadedFiles={watch("documents")}
                onFileUpload={(type, files) => {
                  const currentFiles = watch("documents")?.[type] || [];
                  setValue(`documents.${type}`, [...currentFiles, ...files]);
                }}
                onFileRemove={(type, index) => {
                  const currentFiles = watch("documents")?.[type] || [];
                  setValue(`documents.${type}`, currentFiles.filter((_, i) => i !== index));
                }}
                disabled={isFormDisabled}
              />
            ))}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Thông tin trẻ em</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <p className="font-medium">{watch("childFirstName")} {watch("childLastName")}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ngày sinh:</span>
                  <p className="font-medium">{watch("childDateOfBirth")}</p>
                </div>
                <div>
                  <span className="text-gray-600">Giới tính:</span>
                  <p className="font-medium">
                    {watch("childGender") === "male" ? "Nam" : watch("childGender") === "female" ? "Nữ" : ""}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Chương trình:</span>
                  <p className="font-medium">{watch("program")}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Thông tin phụ huynh/người giám hộ</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <p className="font-medium">{watch("parentFirstName")} {watch("parentLastName")}</p>
                </div>
                <div>
                  <span className="text-gray-600">Mối quan hệ:</span>
                  <p className="font-medium">{watch("relationship")}</p>
                </div>
                <div>
                  <span className="text-gray-600">Điện thoại:</span>
                  <p className="font-medium">{watch("parentPhone")}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{watch("parentEmail")}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Tài liệu đã tải lên</h4>
              <div className="grid grid-cols-1 gap-4 text-sm">
                {Object.keys(ENROLLMENT_REQUIREMENTS).map((key) => {
                  const files = watch("documents")?.[key] || [];
                  return (
                    <div key={key} className="space-y-2">
                      <p className="font-medium text-gray-800">{ENROLLMENT_REQUIREMENTS[key].title}:</p>
                      {files.length === 0 ? (
                        <p className="text-gray-500 text-sm">Chưa có tệp nào được tải lên</p>
                      ) : (
                        <div className="space-y-1">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center">
                                <File className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Sau khi gửi đơn đăng ký, bạn sẽ cần chuẩn bị và nộp các giấy tờ sau:
                  </p>
                  <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
                    <li>Giấy khai sinh của trẻ</li>
                    <li>Sổ tiêm chủng đầy đủ</li>
                    <li>Kết quả khám sức khỏe</li>
                    <li>CMND/CCCD của phụ huynh</li>
                    <li>Lệ phí đăng ký $100</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isFormDisabled}
            className={currentStep === 1 ? "invisible" : ""}
          >
            Quay lại
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              onClick={nextStep}
              disabled={isFormDisabled}
            >
              Tiếp theo
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={isFormDisabled}
              className="flex items-center gap-2"
            >
              {isFormDisabled && <Spinner size="sm" />}
              Gửi đơn đăng ký
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

EnrollmentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default EnrollmentForm;
