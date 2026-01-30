import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { Edit, X, AlignLeft, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

export const TaskDescription = ({
  description,
  taskId,
}: {
  description: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending } = useUpdateTaskDescriptionMutation();

  // Reset state when description prop changes (e.g. real-time updates)
  useEffect(() => {
    setNewDescription(description);
  }, [description]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  const updateDescription = () => {
    if (newDescription === description) {
      setIsEditing(false);
      return;
    }

    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Description updated successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Failed to update description";
          toast.error(errorMessage);
        },
      },
    );
  };

  const handleCancel = () => {
    setNewDescription(description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      updateDescription();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in-95 duration-200">
        <Textarea
          ref={textareaRef}
          className="w-full min-h-[120px] resize-y bg-background text-sm md:text-base leading-relaxed"
          placeholder="Add a more detailed description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
        />
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isPending}
            className="h-8"
          >
            <X className="size-4 mr-2" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={updateDescription}
            disabled={isPending}
            className="h-8"
          >
            {isPending ? (
              "Saving..."
            ) : (
              <>
                <Check className="size-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full">
      {/* Container for display */}
      <div
        onClick={() => setIsEditing(true)}
        className={cn(
          "min-h-20 rounded-md border border-transparent p-3 transition-all duration-200 cursor-pointer",
          // Hover effect to show it's editable
          "hover:bg-accent/40 hover:border-border/50",
          !description &&
            "bg-muted/30 border-dashed border-border flex items-center justify-center sm:justify-start gap-2",
        )}
      >
        {description ? (
          <div className="text-sm md:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed wrap-break-word">
            {description}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm flex items-center gap-2">
            <AlignLeft className="size-4" />
            <span>Add a description...</span>
          </div>
        )}
      </div>

      {/* Edit Icon (Absolute positioned or appearing on hover) */}
      {description && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent click
            setIsEditing(true);
          }}
        >
          <Edit className="size-3.5 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
};
