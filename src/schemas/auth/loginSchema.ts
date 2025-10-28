import { AUTH_VALIDATION_ERRORS } from '@/constants/auth/client';
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email(AUTH_VALIDATION_ERRORS.email.invalid)
    .required(AUTH_VALIDATION_ERRORS.email.required),
  password: yup.string().required(AUTH_VALIDATION_ERRORS.password.required),
});
