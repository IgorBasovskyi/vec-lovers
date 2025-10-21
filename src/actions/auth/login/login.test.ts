import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as general from "@/utils/general/server";
import { getFormFields } from "@/utils/general";
import type { TState } from "@/types/general/server";
import { IValidationError } from "@/types/general/server";
import { loginAction } from "./login";
import prisma from "@/utils/prisma";
import { ROUTE } from "@/types/general/client";
import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/auth/loginSchema";

// -------------------- Test Data --------------------
const INVALID_LOGIN_DATA = {
  email: "invalid-email",
  password: "",
} as const;

const NON_EXISTENT_USER_DATA = {
  email: "nonexistent@example.com",
  password: "password123",
} as const;

const EXISTING_USER_WRONG_PASSWORD = {
  email: "existing@example.com",
  password: "wrongpassword",
} as const;

const VALID_LOGIN_DATA = {
  email: "existing@example.com",
  password: "correctpassword",
} as const;

const VALIDATION_ERRORS = {
  email: "Invalid Email",
  password: "Password is required.",
} as const;

const MOCK_USER = {
  id: "1",
  username: "testuser",
  email: "existing@example.com",
  password: "hashedpassword123",
} as const;

// -------------------- Mocks --------------------
vi.mock("@/utils/general/server", () => ({
  createValidationError: vi.fn(
    (fields: Record<string, string>): IValidationError => ({
      type: "validation",
      fields,
    })
  ),
  createServerError: vi.fn((message?: string) => ({
    type: "error",
    message: message || "Server error. Please try again later.",
  })),
  isValidationError: vi.fn(),
}));

vi.mock("@/utils/general", () => ({
  getFormFields: vi.fn(),
}));

vi.mock("@/utils/prisma", () => ({
  default: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("@/utils/auth/server", () => ({
  createSession: vi.fn(),
  verifyPassword: vi.fn(),
}));

import { createSession, verifyPassword } from "@/utils/auth/server";

const mockFormData = new FormData();

// -------------------- Test Helpers --------------------
const mockGetFormFields = (fields: Record<string, string>) => {
  (getFormFields as unknown as Mock).mockReturnValue(fields);
};

const createYupValidationError = (
  entries: Array<{ path: string; message: string }>
) => ({ inner: entries });

const setupValidationFailure = () => {
  const validationError = createYupValidationError([
    { path: "email", message: VALIDATION_ERRORS.email },
    { path: "password", message: VALIDATION_ERRORS.password },
  ]);
  vi.spyOn(loginSchema, "validate").mockRejectedValue(validationError);
  (general.isValidationError as unknown as Mock).mockReturnValue(true);
};

const setupSuccessfulValidation = (loginData: {
  email: string;
  password: string;
}) => {
  vi.spyOn(loginSchema, "validate").mockResolvedValue(loginData);
  (general.isValidationError as unknown as Mock).mockReturnValue(false);
};

const mockUserFound = (user: typeof MOCK_USER) => {
  (prisma.user.findFirst as unknown as Mock).mockResolvedValue(user);
};

const mockUserNotFound = () => {
  (prisma.user.findFirst as unknown as Mock).mockResolvedValue(null);
};

const mockPasswordVerification = (isValid: boolean) => {
  (verifyPassword as unknown as Mock).mockResolvedValue(isValid);
};

const mockSessionCreation = () => {
  (createSession as unknown as Mock).mockResolvedValue(undefined);
};

// -------------------- Tests --------------------
describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return validation errors when inputs are invalid", async () => {
    // Arrange
    mockGetFormFields(INVALID_LOGIN_DATA);
    setupValidationFailure();

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: "validation",
      fields: VALIDATION_ERRORS,
    });
    expect(general.createValidationError).toHaveBeenCalledWith(
      VALIDATION_ERRORS
    );
  });

  it("should return server error when validation fails with non-validation error", async () => {
    // Arrange
    mockGetFormFields(INVALID_LOGIN_DATA);
    vi.spyOn(loginSchema, "validate").mockRejectedValue(
      new Error("Schema error")
    );
    (general.isValidationError as unknown as Mock).mockReturnValue(false);

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: "error",
      message: "Server error. Please try again later.",
    });
    expect(general.createServerError).toHaveBeenCalledWith();
  });

  it("should return server error when user is not found", async () => {
    // Arrange
    mockGetFormFields(NON_EXISTENT_USER_DATA);
    setupSuccessfulValidation(NON_EXISTENT_USER_DATA);
    mockUserNotFound();

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: "error",
      message: "Invalid email or password",
    });
    expect(general.createServerError).toHaveBeenCalledWith(
      "Invalid email or password"
    );
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: NON_EXISTENT_USER_DATA.email.toLowerCase() },
    });
  });

  it("should return server error when password is incorrect", async () => {
    // Arrange
    mockGetFormFields(EXISTING_USER_WRONG_PASSWORD);
    setupSuccessfulValidation(EXISTING_USER_WRONG_PASSWORD);
    mockUserFound(MOCK_USER);
    mockPasswordVerification(false);

    // Act
    const result: TState = await loginAction(null, mockFormData);

    // Assert
    expect(result).toEqual({
      type: "error",
      message: "Invalid email or password",
    });
    expect(general.createServerError).toHaveBeenCalledWith(
      "Invalid email or password"
    );
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: EXISTING_USER_WRONG_PASSWORD.email.toLowerCase() },
    });
  });

  it("should successfully login and redirect to dashboard when credentials are valid", async () => {
    // Arrange
    mockGetFormFields(VALID_LOGIN_DATA);
    setupSuccessfulValidation(VALID_LOGIN_DATA);
    mockUserFound(MOCK_USER);
    mockPasswordVerification(true);
    mockSessionCreation();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      "NEXT_REDIRECT"
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: VALID_LOGIN_DATA.email.toLowerCase() },
    });

    expect(verifyPassword).toHaveBeenCalledWith(
      VALID_LOGIN_DATA.password,
      MOCK_USER.password
    );

    expect(createSession).toHaveBeenCalledWith(MOCK_USER.id);

    expect(redirect).toHaveBeenCalledWith(ROUTE.DASHBOARD);
  });

  it("should handle case-insensitive email lookup", async () => {
    // Arrange
    const uppercaseEmailData = {
      email: "EXISTING@EXAMPLE.COM",
      password: "correctpassword",
    };
    mockGetFormFields(uppercaseEmailData);
    setupSuccessfulValidation(uppercaseEmailData);
    mockUserFound(MOCK_USER);
    mockPasswordVerification(true);
    mockSessionCreation();

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      "NEXT_REDIRECT"
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: uppercaseEmailData.email.toLowerCase() },
    });
  });

  it("should throw error when database query fails", async () => {
    // Arrange
    mockGetFormFields(VALID_LOGIN_DATA);
    setupSuccessfulValidation(VALID_LOGIN_DATA);
    (prisma.user.findFirst as unknown as Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      "Database connection failed"
    );
  });

  it("should throw error when password verification fails with error", async () => {
    // Arrange
    mockGetFormFields(VALID_LOGIN_DATA);
    setupSuccessfulValidation(VALID_LOGIN_DATA);
    mockUserFound(MOCK_USER);
    (verifyPassword as unknown as Mock).mockRejectedValue(
      new Error("Password verification failed")
    );

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      "Password verification failed"
    );
  });

  it("should throw error when session creation fails", async () => {
    // Arrange
    mockGetFormFields(VALID_LOGIN_DATA);
    setupSuccessfulValidation(VALID_LOGIN_DATA);
    mockUserFound(MOCK_USER);
    mockPasswordVerification(true);
    (createSession as unknown as Mock).mockRejectedValue(
      new Error("Session creation failed")
    );

    // Act & Assert
    await expect(loginAction(null, mockFormData)).rejects.toThrow(
      "Session creation failed"
    );
  });
});
