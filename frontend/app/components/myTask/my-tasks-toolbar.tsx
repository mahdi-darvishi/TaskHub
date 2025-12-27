import { Search, Filter, List, LayoutGrid } from "lucide-react";
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

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterPriority: string;
  setFilterPriority: (val: string) => void;
  view: "list" | "board";
  setView: (val: "list" | "board") => void;
}

export const MyTasksToolbar = ({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  view,
  setView,
}: ToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur py-2 border-b sm:border-none pb-4 sm:pb-0">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 bg-muted/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter
                className={cn(
                  "h-4 w-4",
                  filterPriority !== "ALL" && "text-primary"
                )}
              />
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
      </div>

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
