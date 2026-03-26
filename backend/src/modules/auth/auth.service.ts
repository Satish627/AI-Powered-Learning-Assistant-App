import bcrypt from "bcryptjs";

import {
  signAuthToken,
  type AuthTokenPayload,
} from "../../lib/jwt.js";
import {
  type LoginInput,
  type SignupInput,
} from "./auth.schemas.js";
import { UserModel, type UserDocument } from "./auth.model.js";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  token: string;
  user: SafeUser;
}

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildAuthPayload(user: UserDocument): AuthTokenPayload {
  return {
    userId: user._id.toString(),
    email: user.email,
  };
}

export async function signupUser(input: SignupInput): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AuthError("An account with that email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    name: input.name.trim(),
    email,
    passwordHash,
  });
  const token = signAuthToken(buildAuthPayload(user));

  return {
    token,
    user: toSafeUser(user),
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AuthError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AuthError("Invalid email or password.", 401);
  }

  const token = signAuthToken(buildAuthPayload(user));

  return {
    token,
    user: toSafeUser(user),
  };
}

export async function getSafeUserById(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AuthError("User not found.", 404);
  }

  return toSafeUser(user);
}
