import { useState, useMemo } from "react";
import {
  Archive,
  Search,
  RefreshCcw,
  Trash2,
  Clock,
  Tag,
  AlignLeft,
  Loader2,
  AlertTriangle,
  X,
  User as UserIcon,
} from "lucide-react";
import { format, isToday, isThisWeek, parseISO } from "date-fns";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Hooks
import { useWorkspace } from "@/provider/workspace-provider";
import {
  useGetArchivedTasks,
  useRestoreTaskMutation,
  useDeleteTaskMutation,
} from "@/hooks/use-task-archive";
import type { MetaFunction } from "react-router";
import { cn } from "@/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "TaskHub - Archives" }];
};

// --- Sub-Component: Task Detail Modal ---
const TaskDetailModal = ({
  task,
  isOpen,
  onClose,
  onRestore,
  onDelete,
  isRestoring,
}: {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (id: string) => void;
  onDelete: (task: any) => void;
  isRestoring: boolean;
}) => {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-2 border-b bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-background">
                  {task.project?.title || "Unknown Project"}
                </Badge>
                <Badge
                  className={cn(
                    "border-transparent",
                    task.status === "Done"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {task.status}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold leading-tight">
                {task.title}
              </DialogTitle>
            </div>
            {/* Close button handled by Dialog primitive, but we can add a custom one if needed */}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-4">
            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <Clock className="size-3.5" />
              <span>
                Archived{" "}
                {task.archivedAt
                  ? format(parseISO(task.archivedAt), "PP p")
                  : "N/A"}
              </span>
            </div>

            {task.archivedBy && (
              <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                <Avatar className="size-4">
                  <AvatarImage src={task.archivedBy.profilePicture} />
                  <AvatarFallback>
                    {task.archivedBy.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{task.archivedBy.name}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Content (Scrollable) */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                <AlignLeft className="size-4" /> Description
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed border min-h-[100px] whitespace-pre-wrap">
                {task.description || (
                  <span className="text-muted-foreground italic">
                    No description provided.
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-lg border bg-card/50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Priority
                </h4>
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {task.priority}
                </Badge>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg border bg-card/50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tags
                </h4>
                <div className="flex gap-1.5 flex-wrap">
                  {task.tags && task.tags.length > 0 ? (
                    task.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No tags
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-muted/10 gap-2 sm:gap-0">
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto sm:justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto"
              onClick={() => {
                onClose();
                onDelete(task);
              }}
            >
              <Trash2 className="size-4" /> Delete Forever
            </Button>
            <Button
              className="gap-2 w-full sm:w-auto"
              onClick={() => onRestore(task._id)}
              disabled={isRestoring}
            >
              {isRestoring ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCcw className="size-4" />
              )}
              Restore Task
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Page Component ---
export default function ArchivedPage() {
  const { activeWorkspace } = useWorkspace();
  const workspaceId = activeWorkspace?._id || "";

  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSort, setFilterSort] = useState("newest");

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);

  // --- API Hooks ---
  const { data: tasksData, isLoading } = useGetArchivedTasks(workspaceId, {
    projectId: filterProject,
    status: filterStatus,
    sort: filterSort,
    search: searchQuery,
  });

  const { mutate: restoreTask, isPending: isRestoring } =
    useRestoreTaskMutation();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();

  const tasks = (tasksData as any[]) || [];

  // --- Handlers ---
  const handleRestore = (taskId: string) => {
    restoreTask(taskId, {
      onSuccess: () => {
        toast.success("Task restored successfully");
        if (selectedTask?._id === taskId) setSelectedTask(null);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to restore task");
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;

    deleteTask(
      {
        workspaceId,
        projectId: taskToDelete.project._id || taskToDelete.project,
        taskId: taskToDelete._id,
      },
      {
        onSuccess: () => {
          toast.success("Task deleted permanently");
          setTaskToDelete(null);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to delete task");
        },
      },
    );
  };

  const uniqueProjects = useMemo(() => {
    const projectsMap = new Map();
    tasks.forEach((t) => {
      if (t.project && t.project._id) {
        projectsMap.set(t.project._id, t.project.title);
      }
    });
    return Array.from(projectsMap.entries());
  }, [tasks]);

  const groupedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const groups: Record<string, any[]> = {
      Today: [],
      "This Week": [],
      Older: [],
    };

    tasks.forEach((task) => {
      const dateStr = task.archivedAt || task.updatedAt;
      if (!dateStr) {
        groups["Older"].push(task);
        return;
      }

      const date = parseISO(dateStr);

      if (isToday(date)) {
        groups["Today"].push(task);
      } else if (isThisWeek(date)) {
        groups["This Week"].push(task);
      } else {
        groups["Older"].push(task);
      }
    });

    return Object.entries(groups).filter(([_, t]) => t.length > 0);
  }, [tasks]);

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 dark:bg-orange-900/20 p-2.5 rounded-xl border border-orange-200 dark:border-orange-800 shrink-0">
            <Archive className="size-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Archives</h1>
            <p className="text-muted-foreground text-sm">
              View and manage archived items.
            </p>
          </div>
        </div>
      </div>

      {/* --- Filters Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm shrink-0">
        {/* Search */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search archives..."
            className="pl-9 bg-background w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Divider (Desktop) */}
        <div className="hidden md:block w-px bg-border h-10 mx-2" />

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full">
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full md:w-[150px] h-10">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map(([id, title]) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[130px] h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSort} onValueChange={setFilterSort}>
            <SelectTrigger className="col-span-2 md:col-span-1 w-full md:w-[130px] h-10">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters (Only show if filters active) */}
          {(filterProject !== "all" ||
            filterStatus !== "all" ||
            searchQuery) && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto shrink-0 hidden md:flex"
              onClick={() => {
                setFilterProject("all");
                setFilterStatus("all");
                setSearchQuery("");
              }}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* --- Content Area --- */}
      <ScrollArea className="flex-1 border rounded-xl bg-muted/5 shadow-inner">
        <div className="p-4 sm:p-6 min-h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading archives...</p>
            </div>
          ) : groupedTasks.length > 0 ? (
            <div className="space-y-8 pb-10">
              {groupedTasks.map(([groupName, groupTasks]) => (
                <div key={groupName} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium border bg-background"
                    >
                      {groupName}
                    </Badge>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {groupTasks.map((task) => (
                      <div
                        key={task._id}
                        onClick={() => setSelectedTask(task)}
                        className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer"
                      >
                        {/* Icon */}
                        <div className="hidden sm:flex mt-1 bg-muted p-2.5 rounded-lg shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Archive className="size-5 text-muted-foreground" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 px-1.5 shrink-0"
                            >
                              {task.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 truncate">
                              <Tag className="size-3" />
                              {task.project?.title || "Unknown Project"}
                            </span>

                            <span className="flex items-center gap-1.5 truncate">
                              <Clock className="size-3" />
                              {task.archivedAt
                                ? format(
                                    parseISO(task.archivedAt),
                                    "MMM d, yyyy",
                                  )
                                : "N/A"}
                            </span>

                            {task.archivedBy && (
                              <span className="flex items-center gap-1.5 truncate">
                                <Avatar className="size-3.5">
                                  <AvatarImage
                                    className="object-cover"
                                    src={task.archivedBy.profilePicture}
                                  />
                                  <AvatarFallback className="text-[6px]">
                                    {task.archivedBy.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="max-w-[100px] truncate">
                                  {task.archivedBy.name}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Desktop Actions (Hover only) */}
                        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-center pl-4 border-l">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore(task._id);
                                  }}
                                >
                                  <RefreshCcw className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Restore</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskToDelete(task);
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Forever</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Mobile Indicator (Chevron) */}
                        {/* <div className="sm:hidden absolute top-4 right-4 text-muted-foreground/50">
                            <ChevronRight className="size-4" />
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center opacity-60">
              <div className="bg-background border p-4 rounded-full mb-4 shadow-sm">
                {searchQuery ? (
                  <Search className="size-8 text-muted-foreground" />
                ) : (
                  <Archive className="size-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold text-lg">No archived tasks found</h3>
              <p className="text-sm max-w-xs mx-auto mt-2 text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your filters or search query."
                  : "Items you archive will appear here safely for future reference."}
              </p>
              {(filterProject !== "all" || filterStatus !== "all") && (
                <Button
                  variant="link"
                  onClick={() => {
                    setFilterProject("all");
                    setFilterStatus("all");
                    setSearchQuery("");
                  }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Detail Modal */}
      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onRestore={handleRestore}
        onDelete={setTaskToDelete}
        isRestoring={isRestoring}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Delete Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task{" "}
              <span className="font-bold text-foreground mx-1">
                "{taskToDelete?.title}"
              </span>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
