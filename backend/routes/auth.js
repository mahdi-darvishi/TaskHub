import express from "express";
import { validateRequest } from "zod-express-middleware";

// Import verifyEmail from controller
import {
  loginUser,
  registerUser,
  resetPasswordRequest,
  verifyEmail,
  verifyResetPasswordTokenAndResetPassword,
} from "../controllers/auth-controller.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../libs/validate-schema.js";

const router = express.Router();

// Register Route
router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);

// Login Route
router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);

router.post("/verify-email", verifyEmail);
router.post(
  "/reset-password-request",
  validateRequest({ body: emailSchema }),
  resetPasswordRequest
);

router.post(
  "/reset-password",
  validateRequest({ body: resetPasswordSchema }),
  verifyResetPasswordTokenAndResetPassword
);

export default router;
