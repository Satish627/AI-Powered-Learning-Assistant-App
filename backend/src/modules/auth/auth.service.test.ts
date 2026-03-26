import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../lib/jwt.js", () => ({
  signAuthToken: vi.fn(() => "signed-auth-token"),
}));

import { signAuthToken } from "../../lib/jwt.js";
import { UserModel } from "./auth.model.js";
import { loginUser, signupUser } from "./auth.service.js";

function createMockUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    _id: {
      toString: () => "user-123",
    },
    name: "Ada Lovelace",
    email: "ada@example.com",
    passwordHash: "hashed-password",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("auth.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("signs up a new user and returns a safe user with a token", async () => {
    vi.spyOn(UserModel, "findOne").mockResolvedValue(null);
    vi.spyOn(UserModel, "create").mockResolvedValue(createMockUser() as never);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

    const result = await signupUser({
      name: "Ada Lovelace",
      email: "Ada@Example.com",
      password: "password123",
    });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "ada@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(signAuthToken).toHaveBeenCalledWith({
      userId: "user-123",
      email: "ada@example.com",
    });
    expect(result).toEqual({
      token: "signed-auth-token",
      user: {
        id: "user-123",
        name: "Ada Lovelace",
        email: "ada@example.com",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
  });

  it("rejects duplicate email addresses during signup", async () => {
    vi.spyOn(UserModel, "findOne").mockResolvedValue(createMockUser() as never);

    await expect(
      signupUser({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "password123",
      }),
    ).rejects.toMatchObject({
      message: "An account with that email already exists.",
      statusCode: 409,
    });
  });

  it("logs in an existing user with valid credentials", async () => {
    vi.spyOn(UserModel, "findOne").mockResolvedValue(createMockUser() as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const result = await loginUser({
      email: "ada@example.com",
      password: "password123",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed-password",
    );
    expect(result.token).toBe("signed-auth-token");
    expect(result.user.email).toBe("ada@example.com");
  });

  it("rejects invalid credentials during login", async () => {
    vi.spyOn(UserModel, "findOne").mockResolvedValue(createMockUser() as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      loginUser({
        email: "ada@example.com",
        password: "wrong-pass",
      }),
    ).rejects.toMatchObject({
      message: "Invalid email or password.",
      statusCode: 401,
    });
  });
});
