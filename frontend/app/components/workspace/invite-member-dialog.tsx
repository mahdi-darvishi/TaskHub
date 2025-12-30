import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Copy, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useInviteUserMutation } from "@/hooks/use-workspace";

const ROLES = ["member", "admin", "viewer", "manager"];

interface InviteWorkspaceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  inviteCode: string;
}

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  inviteCode,
}: InviteWorkspaceModalProps) => {
  const [inviteTab, setInviteTab] = useState("email");
  const [linkCopied, setLinkCopied] = useState(false);

  const { mutate: inviteUser, isPending } = useInviteUserMutation();

  const form = useForm({
    defaultValues: { email: "", role: "member" },
  });

  const onSubmit = (values: { email: string; role: string }) => {
    inviteUser(
      { workspaceId, email: values.email, role: values.role },

      {
        onSuccess: (data) => {
          toast.success("Invitation sent successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || "Failed to invite user";
          toast.error(message);
        },
      }
    );
  };
  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/workspaces/join/${workspaceId}/${inviteCode}`;

    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    toast.success("Invite link copied to clipboard");

    setTimeout(() => setLinkCopied(false), 2000);
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

          {/* --- Tab: Email --- */}
          <TabsContent value="email" className="pt-4">
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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

          {/* --- Tab: Link --- */}
          <TabsContent value="link" className="pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Share this link to invite people</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/workspaces/join/${workspaceId}/${inviteCode}`}
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
                Anyone with this link can join this workspace as a member.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
