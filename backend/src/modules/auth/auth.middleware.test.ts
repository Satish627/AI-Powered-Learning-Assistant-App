import { describe, expect, it, vi } from "vitest";

vi.mock("../../lib/jwt.js", () => ({
  AUTH_COOKIE_NAME: "auth_token",
  verifyAuthToken: vi.fn(),
}));

import { verifyAuthToken } from "../../lib/jwt.js";
import { requireAuth } from "../../middleware/require-auth.js";

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe("requireAuth", () => {
  it("returns Unauthorized when the auth cookie is missing", () => {
    const req = { cookies: {} };
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the verified auth payload and continues", () => {
    const req = {
      cookies: {
        auth_token: "signed-token",
      },
    } as Record<string, unknown>;
    const res = createResponse();
    const next = vi.fn();

    vi.mocked(verifyAuthToken).mockReturnValue({
      userId: "user-123",
      email: "ada@example.com",
    });

    requireAuth(req as never, res as never, next);

    expect(verifyAuthToken).toHaveBeenCalledWith("signed-token");
    expect(req.auth).toEqual({
      userId: "user-123",
      email: "ada@example.com",
    });
    expect(next).toHaveBeenCalledOnce();
  });
});
