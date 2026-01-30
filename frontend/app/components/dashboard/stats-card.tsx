import type { StatsCardProps } from "@/types/indedx";
import {
  Activity,
  CheckCircle2,
  Layers,
  ListTodo,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatItem {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

const StatsCard = ({ data }: { data: StatsCardProps }) => {
  const statsItems: StatItem[] = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      description: `${data.totalProjectInProgress} in progress`,
      icon: Layers,
      color: "text-blue-500",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      description: `${data.totalTaskCompleted} completed`,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "To Do",
      value: data.totalTaskToDo,
      description: "Tasks waiting",
      icon: ListTodo,
      color: "text-orange-500",
    },
    {
      title: "In Progress",
      value: data.totalTaskInProgress,
      description: "Currently active",
      icon: Activity,
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="transition-all hover:shadow-md hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-1 md:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${item.color || "text-foreground"}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;
