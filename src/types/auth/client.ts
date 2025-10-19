import { loginSchema } from "@/schemas/auth/loginSchema";
import { registerSchema } from "@/schemas/auth/registerSchema";
import { InferType } from "yup";

export type LoginFormValues = InferType<typeof loginSchema>;

export type RegisterFormValues = InferType<typeof registerSchema>;
