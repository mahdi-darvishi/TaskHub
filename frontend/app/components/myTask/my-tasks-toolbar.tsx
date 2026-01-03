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

// تعریف تایپ برای فیلتر تاریخ (برای جلوگیری از ارور تایپ‌اسکریپت)
export type DateFilterType = "ALL" | "TODAY" | "WEEK" | "OVERDUE";

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;

  filterPriority: string;
  setFilterPriority: (val: string) => void;

  // ✅ اضافه شدن پراپ‌های جدید تاریخ
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur py-2 border-b sm:border-none pb-4 sm:pb-0">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* --- Search Input --- */}
        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 bg-muted/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- Priority Filter --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "shrink-0",
                filterPriority !== "ALL" &&
                  "border-primary text-primary bg-primary/5"
              )}
              title="Filter by Priority"
            >
              <Filter className="h-4 w-4" />
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

        {/* --- Date Filter (New) --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "shrink-0",
                filterDate !== "ALL" &&
                  "border-primary text-primary bg-primary/5"
              )}
              title="Filter by Date"
            >
              <CalendarClock className="h-4 w-4" />
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

      {/* --- View Toggle --- */}
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "list" | "board")}
        className="w-auto"
      >
        <TabsList className="grid w-full grid-cols-2">
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
