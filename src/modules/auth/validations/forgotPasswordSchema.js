import * as yup from 'yup';

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
});
