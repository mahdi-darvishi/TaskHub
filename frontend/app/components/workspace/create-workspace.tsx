import { workspaceSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { Loader2 } from "lucide-react";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

// Define 8 predefined colors
export const colorOptions = [
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#28A745", // Green
  "#FFC300", // Yellow
  "#8E44AD", // Purple
  "#E67E22", // Orange
  "#2ECC71", // Light Green
  "#34495E", // Navy
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateWorkspace();

  const onSubmit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data: any) => {
        form.reset();
        setIsCreatingWorkspace(false);
        toast.success("Workspace created successfully");
        navigate(`/workspaces/${data._id}`);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Failed to create workspace";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog
      open={isCreatingWorkspace}
      onOpenChange={setIsCreatingWorkspace}
      modal={true}
    >
      <DialogContent className="sm:max-w-[450px] w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Create New Workspace
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Workspace Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Design Team"
                      className="h-10 sm:h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Picker */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Theme Color
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-3 sm:gap-4 flex-wrap justify-start">
                      {colorOptions.map((color) => (
                        <div
                          key={color}
                          onClick={() => field.onChange(color)}
                          className={cn(
                            "w-8 h-8 sm:w-7 sm:h-7 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300 shadow-sm",
                            field.value === color &&
                              "ring-2 ring-offset-2 ring-blue-500 scale-110",
                          )}
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What is this workspace for?"
                      className="resize-none min-h-20 sm:min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 sm:pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
