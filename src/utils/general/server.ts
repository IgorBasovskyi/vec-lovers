import { ISuccess } from "@/types/general/server";
import { IServerError, IValidationError } from "@/types/general/server";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/library";
import { ValidationError } from "yup";

export const createSuccessMessage = (message?: string): ISuccess => {
  return {
    message: message || "Success",
    type: "success",
  };
};

export const createServerError = (message?: string): IServerError => {
  return {
    message: message || "Server error. Please try again later.",
    type: "error",
  };
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const createValidationError = (
  fields: IValidationError["fields"]
): IValidationError => {
  return {
    fields,
    type: "validation",
  };
};

export const handlePrismaError = <T extends string = string>(
  err: unknown,
  fieldMap?: Record<string, T>
): IValidationError | IServerError => {
  // Quick check: if it's not a Prisma error, return generic server error immediately
  if (
    !(err instanceof PrismaClientKnownRequestError) &&
    !(err instanceof PrismaClientValidationError) &&
    !(err instanceof PrismaClientInitializationError) &&
    !(err instanceof PrismaClientRustPanicError)
  ) {
    return createServerError("Server error. Please try again later.");
  }

  // Handle Prisma known request errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint violation - use existing logic
        const target = err.meta?.target;
        const fieldKey = Array.isArray(target) ? target[0] : target ?? "field";
        const mappedField = fieldMap?.[fieldKey] ?? fieldKey;

        return createValidationError({
          [mappedField]: `This ${mappedField} is already taken`,
        } as Record<string, string>);

      case "P2003":
        // Foreign key constraint violation
        return createServerError("Invalid reference in data.");

      case "P2025":
        // Record not found
        return createServerError("Required data not found.");

      default:
        return createServerError(
          "Database operation failed. Please try again."
        );
    }
  }

  // Handle Prisma validation errors
  if (err instanceof PrismaClientValidationError) {
    return createServerError("Invalid data provided. Please check your input.");
  }

  // Handle connection errors
  if (err instanceof PrismaClientInitializationError) {
    return createServerError(
      "Database connection error. Please try again later."
    );
  }

  // Handle request timeout errors
  if (err instanceof PrismaClientRustPanicError) {
    return createServerError("Database operation timed out. Please try again.");
  }

  // Generic error fallback for any other errors
  return createServerError("Server error. Please try again later.");
};
