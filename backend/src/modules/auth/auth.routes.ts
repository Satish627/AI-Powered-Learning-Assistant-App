import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";
import {
  currentUserController,
  loginController,
  logoutController,
  signupController,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/me", requireAuth, currentUserController);
