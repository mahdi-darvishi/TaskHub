import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

export const MyTasksHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Tasks
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Stay on top of your work across all projects.
        </p>
      </div>
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-background rounded-lg border shadow-sm w-fit self-start md:self-auto">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
          {format(new Date(), "EEEE d MMMM yyyy")}
        </span>
      </div>
    </div>
  );
};
