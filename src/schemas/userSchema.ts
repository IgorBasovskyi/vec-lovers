import * as yup from "yup";

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username should not contain more than 20 characters.")
    .required("Username is required."),

  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match.")
    .required("Please confirm your password."),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid Email").required("Email is required."),
  password: yup.string().required("Password is required."),
});
