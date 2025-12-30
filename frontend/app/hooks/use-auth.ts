import { postData, updateData } from "@/lib/fetch-util";
import type { SignupFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignupFormData) => postData("/auth/register", data),
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postData("/auth/login", data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postData("/auth/reset-password-request", data),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }) => postData("/auth/reset-password", data),
  });
};
// 1. Hook for Enabling/Disabling 2FA (Settings Page)
export const useToggle2FAMutation = () => {
  return useMutation({
    mutationFn: (data: { isEnabled: boolean; password: string }) =>
      updateData("/user/toggle-2fa", data),
  });
};

// 2. Hook for Verifying OTP (Login Page)
export const useVerify2FAMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      postData("/auth/verify-2fa", data),
  });
};
