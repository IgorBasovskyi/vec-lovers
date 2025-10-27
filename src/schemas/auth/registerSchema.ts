import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';
import * as yup from 'yup';

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, AUTH_VALIDATION_ERRORS.username.minLength)
    .max(20, AUTH_VALIDATION_ERRORS.username.maxLength)
    .required(AUTH_VALIDATION_ERRORS.username.required),

  email: yup
    .string()
    .email(AUTH_VALIDATION_ERRORS.email.invalid)
    .required(AUTH_VALIDATION_ERRORS.email.required),

  password: yup
    .string()
    .min(8, AUTH_VALIDATION_ERRORS.password.minLength)
    .required(AUTH_VALIDATION_ERRORS.password.required),

  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password')],
      AUTH_VALIDATION_ERRORS.confirmPassword.mismatch
    )
    .required(AUTH_VALIDATION_ERRORS.confirmPassword.required),
});
