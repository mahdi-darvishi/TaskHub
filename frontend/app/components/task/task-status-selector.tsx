import type { TaskStatus } from "@/types/indedx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  ArrowUpCircle,
} from "lucide-react";

// پیکربندی رنگ و آیکون برای هر وضعیت
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; bg: string }
> = {
  "To Do": {
    label: "To Do",
    icon: Circle,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
  "In Progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  Done: {
    label: "Done",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  // اگر وضعیت‌های دیگری مثل Review دارید اینجا اضافه کنید
};

interface TaskStatusSelectorProps {
  status: TaskStatus;
  taskId: string;
  className?: string; // برای انعطاف‌پذیری بیشتر
}

export const TaskStatusSelector = ({
  status,
  taskId,
  className,
}: TaskStatusSelectorProps) => {
  const { mutate, isPending } = useUpdateTaskStatusMutation();

  const handleStatusChange = (value: string) => {
    // جلوگیری از آپدیت تکراری
    if (value === status) return;

    mutate(
      { taskId, status: value as TaskStatus },
      {
        onSuccess: () => {
          toast.success(`Status changed to ${value}`);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Failed to update status";
          toast.error(errorMessage);
        },
      },
    );
  };

  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG["To Do"];

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "w-full sm:w-40 h-9 transition-all duration-200 border-transparent hover:border-border",
          currentConfig.bg,
          "focus:ring-1 focus:ring-offset-0",
          className,
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <currentConfig.icon
              className={cn("size-4 shrink-0", currentConfig.color)}
            />
          )}

          <span
            className={cn("text-sm font-medium truncate", currentConfig.color)}
          >
            <SelectValue placeholder="Status" />
          </span>
        </div>
      </SelectTrigger>

      <SelectContent align="start">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <SelectItem key={key} value={key} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <config.icon className={cn("size-4", config.color)} />
              <span className={cn(config.color)}>{config.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
