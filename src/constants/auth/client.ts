import { LoginFormValues, RegisterFormValues } from "@/types/auth/client";

export const COMMON_FIELDS = {
  email: "",
  password: "",
};

export const LOGIN_DEFAULT_VALUES: LoginFormValues = {
  ...COMMON_FIELDS,
};

export const REGISTRATION_DEFAULT_VALUES: RegisterFormValues = {
  ...COMMON_FIELDS,
  username: "",
  confirmPassword: "",
};
