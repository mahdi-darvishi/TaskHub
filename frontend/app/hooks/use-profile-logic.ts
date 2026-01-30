import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useUploadImageMutation } from "@/hooks/use-upload";
import {
  useChangePassword,
  useUpdateUserProfile,
  useUserProfile,
} from "@/hooks/use-user";
import { useAuth } from "@/provider/auth-context";
import { type User } from "@/types/indedx";

// --- Zod Schemas ---
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 chars"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profilePicture: z.string().optional(),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;

// --- The Custom Hook ---
export const useProfileLogic = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 1. Fetch User Data
  const { data: user, isPending: isUserLoading } = useUserProfile() as {
    data: User | undefined;
    isPending: boolean;
  };

  // 2. Mutations
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadImageMutation();
  const { mutate: updateUser, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const {
    mutate: changePass,
    isPending: isChangingPassword,
    error: passError,
  } = useChangePassword();

  // 3. Forms Setup
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", profilePicture: "" },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 4. Sync User Data with Form (when user data loads)
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user, profileForm]);

  // --- Helper for Security Logout ---
  const performSecurityLogout = (message: string) => {
    toast.success(message);
    setTimeout(() => {
      logout();
      navigate("/sign-in");
    }, 1500);
  };

  // --- Handlers ---

  // Handle Image Upload
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, {
        onSuccess: (data: any) => {
          profileForm.setValue("profilePicture", data.filePath, {
            shouldDirty: true,
            shouldValidate: true,
          });
          toast.success("Image uploaded! Click Save Changes to apply.");
        },
        onError: () => toast.error("Failed to upload image"),
      });
    }
  };

  // Handle Profile Update (Now Logs out on success)
  const onProfileSubmit = (values: ProfileFormData) => {
    updateUser(
      { name: values.name, profilePicture: values.profilePicture },
      {
        onSuccess: () => {
          performSecurityLogout("Profile updated. Please log in again.");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to update profile",
          );
        },
      },
    );
  };

  // Handle Password Change (Logs out on success)
  const onPasswordSubmit = (values: ChangePasswordFormData) => {
    changePass(values, {
      onSuccess: () => {
        passwordForm.reset();
        performSecurityLogout("Password changed. Please log in again.");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to change password");
      },
    });
  };

  return {
    user,
    isUserLoading,
    profileForm,
    passwordForm,
    isLoading: isUpdatingProfile || isUploading,
    isChangingPassword,
    passError,
    handlers: {
      onAvatarChange,
      onProfileSubmit,
      onPasswordSubmit,
    },
  };
};
