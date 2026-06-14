import * as yup from 'yup';

export const createAccountSchema = yup.object().shape({
  role: yup
    .string()
    .required('Please select your role')
    .oneOf(['Student', 'Doctor', 'Teacher Assistant'], 'Invalid role selected'),
  fullName: yup
    .string()
    .required('Full Name is required')
    .min(3, 'Full name must be at least 3 characters'),
  academicId: yup
    .string()
    .required('ID / Academic ID is required'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});
