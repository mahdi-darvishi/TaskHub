import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit, Check, X } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdateTaskTitleMutation();

  // Reset title when switching to edit mode & Focus input
  useEffect(() => {
    if (isEditing) {
      setNewTitle(title);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isEditing, title]);

  const updateTitle = () => {
    // If title hasn't changed or is empty, just close edit mode
    if (newTitle.trim() === "" || newTitle === title) {
      setIsEditing(false);
      setNewTitle(title);
      return;
    }

    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Task title updated successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Failed to update task title";
          toast.error(errorMessage);
        },
      },
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateTitle();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <Input
          ref={inputRef}
          className="h-9 sm:h-10 text-lg sm:text-xl md:text-2xl font-bold px-2 py-1 bg-background border-primary/50 focus-visible:ring-1"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
        />
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="size-4" />
          </Button>
          <Button
            size="icon"
            className="size-8 text-primary-foreground"
            onClick={updateTitle}
            disabled={isPending}
          >
            <Check className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 w-full max-w-full overflow-hidden">
      <h1
        onClick={() => setIsEditing(true)}
        className="text-lg sm:text-xl md:text-2xl font-bold truncate cursor-pointer hover:underline decoration-dashed underline-offset-4 decoration-muted-foreground/50 transition-all"
        title={title}
      >
        {title}
      </h1>

      <Button
        variant="ghost"
        size="icon"
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={() => setIsEditing(true)}
      >
        <Edit className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default TaskTitle;
