import type { NextFunction, Request, Response } from "express";

import {
  AUTH_COOKIE_NAME,
  verifyAuthToken,
  type AuthTokenPayload,
} from "../lib/jwt.js";

export type AuthenticatedRequest = Request & {
  auth: AuthTokenPayload;
};

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const payload = verifyAuthToken(token);
    (req as AuthenticatedRequest).auth = payload;
    return next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
