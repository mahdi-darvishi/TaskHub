import { useState, useMemo } from "react";
import {
  Archive,
  Search,
  RefreshCcw,
  Trash2,
  Filter,
  Eye,
  Clock,
  Tag,
  AlignLeft,
  Loader2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { format, isToday, isThisWeek, parseISO } from "date-fns";
import { toast } from "sonner"; // یا هر کتابخانه توستی که داری

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
  DialogDescription,
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
import { useWorkspace } from "@/provider/workspace-provider"; // مسیر را چک کن
import {
  useGetArchivedTasks,
  useRestoreTaskMutation,
  useDeleteTaskMutation,
} from "@/hooks/use-task-archive";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {task.project?.title || "Unknown Project"}
              </Badge>
              <Badge
                className={
                  task.status === "Done"
                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {task.status}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              Archived{" "}
              {task.archivedAt
                ? format(parseISO(task.archivedAt), "PP p")
                : "Unknown date"}
            </span>
          </div>
          <DialogTitle className="text-xl mt-2">{task.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            Archived by
            {task.archivedBy ? (
              <span className="font-medium text-foreground flex items-center gap-1">
                <Avatar className="size-5 border">
                  <AvatarImage src={task.archivedBy.profilePicture} />
                  <AvatarFallback className="text-[9px]">
                    {task.archivedBy.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {task.archivedBy.name}
              </span>
            ) : (
              "System / Auto"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <AlignLeft className="size-4" /> Description
            </h4>
            <div className="bg-muted/30 p-3 rounded-lg text-sm leading-relaxed border min-h-[80px]">
              {task.description || (
                <span className="text-muted-foreground italic">
                  No description provided.
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Priority
              </h4>
              <Badge variant="secondary" className="font-normal">
                {task.priority}
              </Badge>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Tags
              </h4>
              <div className="flex gap-1 flex-wrap">
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => {
                onClose();
                onDelete(task);
              }}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
            <Button
              className="gap-2"
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
      }
    );
  };

  // --- Logic: Extract unique projects for filter dropdown ---
  // (Optional: If you have a separate project list hook, use that instead)
  const uniqueProjects = useMemo(() => {
    const projectsMap = new Map();
    tasks.forEach((t) => {
      if (t.project && t.project._id) {
        projectsMap.set(t.project._id, t.project.title);
      }
    });
    return Array.from(projectsMap.entries());
  }, [tasks]);

  // --- Logic: Group Tasks by Date ---
  const groupedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const groups: Record<string, any[]> = {
      Today: [],
      "This Week": [],
      Older: [],
    };

    tasks.forEach((task) => {
      const dateStr = task.archivedAt || task.updatedAt; // Fallback to updatedAt
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
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 dark:bg-orange-900/20 p-2.5 rounded-xl border border-orange-200 dark:border-orange-800">
            <Archive className="size-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Archives</h1>
            <p className="text-muted-foreground text-sm">
              Manage and restore your previously completed or canceled items.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search archived items..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-start md:items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="size-4 text-muted-foreground mr-1" />

          <div className="flex gap-2 items-center flex-col md:flex-row">
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="All Projects" />
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
              <SelectTrigger className="w-[120px] h-9 text-xs">
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
              <SelectTrigger className="w-[130px] h-9 text-xs">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="h-[600px] pr-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Loading archived tasks...</p>
          </div>
        ) : groupedTasks.length > 0 ? (
          <div className="space-y-8">
            {groupedTasks.map(([groupName, groupTasks]) => (
              <div key={groupName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-sm font-medium bg-muted/50 text-muted-foreground border-transparent"
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
                      className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer"
                    >
                      {/* Left: Info */}
                      <div className="flex items-start gap-4 w-full sm:w-auto">
                        <div className="mt-1 bg-muted/50 p-2.5 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Archive className="size-5 text-muted-foreground group-hover:text-primary" />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 px-1.5 font-normal rounded-md"
                            >
                              {task.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Tag className="size-3" />
                              {task.project?.title || "Unknown Project"}
                            </span>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {task.archivedBy ? (
                                      <>
                                        <Avatar className="size-4 border">
                                          <AvatarImage
                                            src={task.archivedBy.profilePicture}
                                          />
                                          <AvatarFallback className="text-[8px]">
                                            {task.archivedBy.name?.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        Archived by{" "}
                                        {task.archivedBy.name?.split(" ")[0]}
                                      </>
                                    ) : (
                                      <span>Archived (Auto)</span>
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {task.archivedAt
                                      ? format(
                                          parseISO(task.archivedAt),
                                          "PP p"
                                        )
                                      : "Unknown date"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs h-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                          disabled={isRestoring}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(task._id);
                          }}
                        >
                          {isRestoring && selectedTask?._id === task._id ? (
                            <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <RefreshCcw className="size-3.5 mr-1.5" />
                          )}
                          Restore
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskToDelete(task);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>

                        <div className="sm:hidden text-muted-foreground">
                          <Eye className="size-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-60">
            <div className="bg-muted p-4 rounded-full mb-4">
              {searchQuery ? (
                <Search className="size-8" />
              ) : (
                <Archive className="size-8" />
              )}
            </div>
            <h3 className="font-semibold text-lg">No archived tasks found</h3>
            <p className="text-sm max-w-xs mx-auto mt-1">
              {searchQuery
                ? "Try adjusting your filters or search query."
                : "Items you archive will appear here safely for future reference."}
            </p>
          </div>
        )}
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
