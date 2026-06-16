import * as yup from 'yup';

export const createStaffSchema = yup.object({
  fullName:        yup.string().required('Full name is required'),
  email:           yup.string().email('Invalid email').required('Email is required'),
  password:        yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number'),
  role:            yup.string().required('Role is required').oneOf(['Professor']),
});

