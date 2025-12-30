import { ShieldCheck, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTwoFactorController } from "@/hooks/use-two-factor-controller";
import type { User } from "@/types/indedx";

export const TwoFactorCard = ({ user }: { user: User | null }) => {
  const {
    is2FAEnabled,
    isDialogOpen,
    setIsDialogOpen,
    pendingStatus,
    form,
    isLoading,
    handleSwitchClick,
    onConfirmPassword,
  } = useTwoFactorController(user);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">
                Email Authentication
              </Label>
              <p className="text-sm text-muted-foreground max-w-[300px] sm:max-w-md">
                Require a verification code via email upon login.
              </p>
            </div>
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handleSwitchClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Password</DialogTitle>
            <DialogDescription>
              Please enter your password to{" "}
              <strong>{pendingStatus ? "enable" : "disable"}</strong> 2FA.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onConfirmPassword)}>
              <div className="py-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
