import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearedAuthCookieOptions,
} from "../../lib/jwt.js";
import { AuthenticatedRequest } from "../../middleware/require-auth.js";
import {
  AuthError,
  getSafeUserById,
  loginUser,
  signupUser,
} from "./auth.service.js";
import { loginSchema, signupSchema } from "./auth.schemas.js";

function handleError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request payload.",
      issues: error.flatten(),
    });
  }

  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error("Auth controller failed", error);

  return res.status(500).json({
    message: "Something went wrong while processing the request.",
  });
}

export async function signupController(req: Request, res: Response) {
  try {
    const payload = signupSchema.parse(req.body);
    const result = await signupUser(payload);

    res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    return res.status(201).json({
      user: result.user,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload);

    res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    return res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export function logoutController(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, getClearedAuthCookieOptions());

  return res.status(200).json({
    message: "Logged out successfully.",
  });
}

export async function currentUserController(
  req: Request,
  res: Response,
) {
  try {
    const authReq = req as AuthenticatedRequest;
    const user = await getSafeUserById(authReq.auth.userId);

    return res.status(200).json({ user });
  } catch (error) {
    return handleError(error, res);
  }
}
