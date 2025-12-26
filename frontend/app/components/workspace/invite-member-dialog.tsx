import { inviteMemberSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Mail, Loader2 } from "lucide-react"; // Loader2 اضافه شد
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"; // FormMessage اضافه شد
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useInviteMemberMutation } from "@/hooks/use-workspace"; // هوک خودمان
import { toast } from "sonner"; // برای نمایش پیام

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const ROLES = ["admin", "member", "viewer"] as const; // نقش‌ها را ثابت کردیم

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
}: InviteMemberDialogProps) => {
  const [inviteTab, setInviteTab] = useState("email");
  const [linkCopied, setLinkCopied] = useState(false);

  // 1. استفاده از هوک کاستوم برای ارسال درخواست
  const { mutate, isPending } = useInviteMemberMutation(workspaceId);

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  // 2. تابع هندل کردن سابمیت فرم
  const onSubmit = (values: InviteMemberFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Invitation sent successfully");
        form.reset(); // پاک کردن فرم
        onOpenChange(false); // بستن دیالوگ
      },
      onError: (error: any) => {
        // مدیریت ارور در هوک هم انجام شده اما اینجا هم محض احتیاط هست
        const msg = error.response?.data?.message || "Failed to invite member";
        toast.error(msg);
      },
    });
  };

  const handleCopyInviteLink = () => {
    // لینک را کپی میکند (مطمئن شوید روت /join در فرانت دارید)
    const inviteLink = `${window.location.origin}/workspaces/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    toast.success("Link copied to clipboard");

    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to Workspace</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="email"
          value={inviteTab}
          onValueChange={setInviteTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" disabled={isPending}>
              Send Email
            </TabsTrigger>
            <TabsTrigger value="link" disabled={isPending}>
              Share Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="pt-4">
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* فیلد ایمیل */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="name@example.com"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* فیلد نقش (Role) */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Role</FormLabel>
                        <FormControl>
                          <div className="flex gap-3 flex-wrap">
                            {ROLES.map((role) => (
                              <label
                                key={role}
                                className="flex items-center cursor-pointer gap-2"
                              >
                                <input
                                  type="radio"
                                  value={role}
                                  className="peer hidden"
                                  checked={field.value === role}
                                  onChange={() => field.onChange(role)}
                                  disabled={isPending}
                                />
                                <span
                                  className={cn(
                                    "w-7 h-7 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground text-transparent"
                                    // استایل برای حالت انتخاب شده
                                  )}
                                >
                                  <Check className="w-4 h-4" />
                                </span>
                                <span className="capitalize text-sm font-medium">
                                  {role}
                                </span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* دکمه ارسال */}
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    size={"lg"}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="link" className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Share this link to invite people</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/workspaces/join/${workspaceId}`}
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyInviteLink}
                    disabled={isPending}
                    size="icon"
                    variant="outline"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can join this workspace as a member.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
