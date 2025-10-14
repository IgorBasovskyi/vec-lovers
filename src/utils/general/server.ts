import { IValidationError } from "@/types/auth/server";
import { IServerError } from "@/types/general/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ValidationError } from "yup";

export const createServerError = (message?: string): IServerError => {
  return {
    message: message || "Server error. Please try again later.",
    type: "error",
  };
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

// TODO: try to apply specific types

export const createValidationError = (
  fields: IValidationError["fields"]
): IValidationError => {
  return {
    fields,
    type: "validation",
  };
};

export const handlePrismaUniqueError = <T extends string = string>(
  err: PrismaClientKnownRequestError,
  fieldMap?: Record<string, T>
) => {
  if (err.code !== "P2002") return createServerError();

  const target = err.meta?.target;
  const fieldKey = Array.isArray(target) ? target[0] : target ?? "field";

  const mappedField = fieldMap?.[fieldKey] ?? fieldKey;

  return createValidationError({
    [mappedField]: `This ${mappedField} is already taken`,
  } as Record<string, string>);
};
