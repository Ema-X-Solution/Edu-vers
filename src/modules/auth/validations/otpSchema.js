import * as yup from 'yup';

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP code is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});
