import { useUpdateTaskDueDateMutation } from "@/hooks/use-task";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const TaskDueDate = ({
  dueDate,
  taskId,
}: {
  dueDate: string | Date | null;
  taskId: string | undefined;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(
    dueDate ? new Date(dueDate) : undefined
  );

  const { mutate, isPending } = useUpdateTaskDueDateMutation();

  const updateDueDate = () => {
    mutate(
      {
        taskId,
        dueDate: newDueDate ? newDueDate.toISOString() : null,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Due date updated successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
          console.error(error);
        },
      }
    );
  };

  const clearDueDate = () => {
    setNewDueDate(undefined);
  };

  return (
    <div className="text-sm md:text-base font-normal mt-1 flex gap-2 items-center">
      <div className="">
        Due Date:{" "}
        <span className="text-muted-foreground">
          {dueDate ? format(new Date(dueDate), "MMMM d, yyyy") : "Not set"}
        </span>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Edit className="h-3 w-3 cursor-pointer hover:text-primary transition-colors" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Due Date</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Select due date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newDueDate && "text-muted-foreground"
                    )}
                    disabled={isPending}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDueDate ? (
                      format(newDueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newDueDate}
                    onSelect={setNewDueDate}
                    initialFocus
                    disabled={isPending}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearDueDate}
                variant="outline"
                className="flex-1"
                disabled={isPending || !newDueDate}
              >
                Clear
              </Button>
              <Button
                onClick={updateDueDate}
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Save"}
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-current" />
                Current due date:{" "}
                {dueDate ? format(new Date(dueDate), "PPP") : "Not set"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
