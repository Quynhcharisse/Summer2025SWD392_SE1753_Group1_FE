// Enrollment related constants

export const ENROLLMENT_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED', 
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WAITLISTED: 'WAITLISTED'
};

export const DOCUMENT_TYPES = {
  BIRTH_CERTIFICATE: 'birth_certificate',
  IMMUNIZATION_RECORDS: 'immunization_records',
  MEDICAL_FORM: 'medical_form',
  PREVIOUS_SCHOOL_RECORDS: 'previous_school_records',
  EMERGENCY_CONTACT: 'emergency_contact',
  PARENT_ID: 'parent_id',
  CHILD_PHOTO: 'child_photo'
};

export const PROGRAMS = {
  TODDLER: 'toddler',
  PRESCHOOL: 'preschool', 
  PRE_K: 'prekindergarten'
};

export const RELATIONSHIPS = {
  MOTHER: 'mother',
  FATHER: 'father',
  GUARDIAN: 'guardian',
  GRANDPARENT: 'grandparent',
  OTHER: 'other'
};

export const ENROLLMENT_REQUIREMENTS = [
  {
    id: 'application_form',
    title: 'Completed Application Form',
    description: 'Fill out the online enrollment application with child and family information',
    required: true,
    documentType: null
  },
  {
    id: 'birth_certificate', 
    title: 'Child\'s Birth Certificate',
    description: 'Official birth certificate or certified copy',
    required: true,
    documentType: DOCUMENT_TYPES.BIRTH_CERTIFICATE
  },
  {
    id: 'immunization_records',
    title: 'Immunization Records', 
    description: 'Up-to-date vaccination records from healthcare provider',
    required: true,
    documentType: DOCUMENT_TYPES.IMMUNIZATION_RECORDS
  },
  {
    id: 'medical_form',
    title: 'Medical Examination Form',
    description: 'Completed medical form signed by licensed physician',
    required: true,
    documentType: DOCUMENT_TYPES.MEDICAL_FORM
  },
  {
    id: 'emergency_contact',
    title: 'Emergency Contact Information',
    description: 'At least two emergency contacts besides parents/guardians',
    required: true,
    documentType: DOCUMENT_TYPES.EMERGENCY_CONTACT
  },
  {
    id: 'previous_school',
    title: 'Previous School Records',
    description: 'Academic records from previous preschool or daycare (if applicable)',
    required: false,
    documentType: DOCUMENT_TYPES.PREVIOUS_SCHOOL_RECORDS
  },
  {
    id: 'registration_fee',
    title: 'Registration Fee',
    description: '$100 non-refundable registration fee',
    required: true,
    documentType: null
  },
  {
    id: 'first_month_deposit',
    title: 'First Month Tuition Deposit',
    description: 'First month tuition payment to secure enrollment',
    required: true,
    documentType: null
  }
];

export const ADMISSION_STEPS = [
  {
    step: 1,
    title: 'Schedule a Tour',
    description: 'Visit our facility and meet our teachers',
    action: 'Book Tour',
    required: false
  },
  {
    step: 2, 
    title: 'Submit Application',
    description: 'Complete the online enrollment application form',
    action: 'Apply Now',
    required: true
  },
  {
    step: 3,
    title: 'Document Submission',
    description: 'Upload required documents and forms',
    action: 'Upload Documents',
    required: true
  },
  {
    step: 4,
    title: 'Interview & Assessment', 
    description: 'Brief meeting with child and family',
    action: 'Schedule Interview',
    required: true
  },
  {
    step: 5,
    title: 'Enrollment Confirmation',
    description: 'Secure your spot with deposit payment',
    action: 'Pay Deposit',
    required: true
  }
];
