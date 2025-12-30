import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { User } from "@/types/indedx";
import { useToggle2FAMutation } from "./use-auth";

const confirmSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const useTwoFactorController = (user: User | null) => {
  // States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);

  // Sync with user data initially
  useEffect(() => {
    if (user) setIs2FAEnabled(user.is2FAEnabled || false);
  }, [user]);

  // Form
  const form = useForm({
    resolver: zodResolver(confirmSchema),
    defaultValues: { password: "" },
  });

  // Mutation
  const { mutate, isPending } = useToggle2FAMutation();

  // Handlers
  const handleSwitchClick = (checked: boolean) => {
    setPendingStatus(checked);
    setIsDialogOpen(true);
  };

  const onConfirmPassword = (values: { password: string }) => {
    mutate(
      { isEnabled: pendingStatus, password: values.password },
      {
        onSuccess: (data: any) => {
          setIs2FAEnabled(data.is2FAEnabled);
          toast.success(data.message);
          setIsDialogOpen(false);
          form.reset();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Operation failed");
        },
      }
    );
  };

  return {
    is2FAEnabled,
    isDialogOpen,
    setIsDialogOpen,
    pendingStatus,
    form,
    isLoading: isPending,
    handleSwitchClick,
    onConfirmPassword,
  };
};
