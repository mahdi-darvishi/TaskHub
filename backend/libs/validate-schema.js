import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  email: z.string().email("Invalid email address"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const WorkspaceSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
});

export {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
  WorkspaceSchema,
};
