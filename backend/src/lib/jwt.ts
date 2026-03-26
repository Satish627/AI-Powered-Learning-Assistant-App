import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_TOKEN_TTL = "30d";
export const AUTH_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: AUTH_TOKEN_TTL,
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_TOKEN_MAX_AGE_MS,
  };
}

export function getClearedAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    path: "/",
  };
}
