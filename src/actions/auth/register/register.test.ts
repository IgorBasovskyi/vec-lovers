import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as general from "@/utils/general/server";
import { registerSchema } from "@/schemas/userSchema";
import { getFormFields } from "@/utils/general";
import type { TState } from "@/types/auth/server";
import { IValidationError } from "@/types/general/server";
import { registerAction } from "./register";
import prisma from "@/utils/prisma";

// -------------------- Mocks --------------------

vi.mock("@/utils/general/server", () => ({
  createValidationError: vi.fn(
    (fields: Record<string, string>): IValidationError => ({
      type: "validation",
      fields,
    })
  ),
  createServerError: vi.fn(() => ({ type: "error", message: "Server error" })),
  isValidationError: vi.fn(),
}));

vi.mock("@/utils/general", () => ({
  getFormFields: vi.fn(),
}));

vi.mock("@/utils/prisma", () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

const mockFormData = new FormData();

// -------------------- Test helpers --------------------
const mockGetFormFields = (fields: Record<string, string>) => {
  (getFormFields as unknown as Mock).mockReturnValue(fields);
};

const makeYupValidationError = (
  entries: Array<{ path: string; message: string }>
) => ({ inner: entries });

// -------------------- Test --------------------
describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns YUP validation errors if inputs are not valid", async () => {
    const mockFields = {
      username: "",
      email: "invalid",
      password: "123",
      confirmPassword: "321",
    };

    mockGetFormFields(mockFields);

    const validationError = makeYupValidationError([
      { path: "email", message: "Email is invalid" },
      { path: "username", message: "Username is required" },
      { path: "password", message: "Password must be at least 8 characters." },
      { path: "confirmPassword", message: "Passwords do not match." },
    ]);

    vi.spyOn(registerSchema, "validate").mockRejectedValue(validationError);
    (general.isValidationError as unknown as Mock).mockReturnValue(true);

    const result: TState = await registerAction(null, mockFormData);

    expect(result).toEqual({
      type: "validation",
      fields: {
        email: "Email is invalid",
        username: "Username is required",
        password: "Password must be at least 8 characters.",
        confirmPassword: "Passwords do not match.",
      },
    });
  });

  it("returns error that user already exists", async () => {
    const mockFields = {
      username: "testuser",
      email: "existing@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    mockGetFormFields(mockFields);

    vi.spyOn(registerSchema, "validate").mockResolvedValue(mockFields);
    (general.isValidationError as unknown as Mock).mockReturnValue(false);

    (prisma.user.findUnique as unknown as Mock).mockResolvedValue({
      id: "1",
      username: "testuser",
      email: "existing@example.com",
      password: "hashedpassword",
    });

    const result: TState = await registerAction(null, mockFormData);

    expect(result).toEqual({
      type: "validation",
      fields: {
        email: "A user with this email already exists",
      },
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "existing@example.com" },
    });
  });
});
