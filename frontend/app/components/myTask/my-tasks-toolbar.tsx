import { Search, Filter, List, LayoutGrid, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type DateFilterType = "ALL" | "TODAY" | "WEEK" | "OVERDUE";

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterPriority: string;
  setFilterPriority: (val: string) => void;
  filterDate: DateFilterType;
  setFilterDate: (val: DateFilterType) => void;
  view: "list" | "board";
  setView: (val: "list" | "board") => void;
}

export const MyTasksToolbar = ({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  filterDate,
  setFilterDate,
  view,
  setView,
}: ToolbarProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur py-2 pb-4 lg:pb-2">
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 bg-muted/30 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 sm:flex-none justify-between sm:justify-center",
                  filterPriority !== "ALL" &&
                    "border-primary text-primary bg-primary/5",
                )}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="sm:hidden">Priority</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterPriority("ALL")}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("High")}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Medium")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Low")}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 sm:flex-none justify-between sm:justify-center",
                  filterDate !== "ALL" &&
                    "border-primary text-primary bg-primary/5",
                )}
              >
                <span className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span className="sm:hidden">Date</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterDate("ALL")}>
                All Dates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterDate("TODAY")}>
                Due Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterDate("WEEK")}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterDate("OVERDUE")}
                className="text-destructive focus:text-destructive"
              >
                Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "list" | "board")}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" /> List
          </TabsTrigger>
          <TabsTrigger value="board">
            <LayoutGrid className="h-4 w-4 mr-2" /> Board
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
