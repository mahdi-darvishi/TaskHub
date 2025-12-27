import {
  List,
  Clock,
  AlertCircle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: {
    total: number;
    dueToday: number;
    overdue: number;
    completed: number;
  };
}

export const MyTasksStats = ({ stats }: StatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        label="Total Tasks"
        value={stats.total}
        icon={List}
        color="text-primary"
      />
      <StatsCard
        label="Due Today"
        value={stats.dueToday}
        icon={Clock}
        color="text-blue-500"
        active={stats.dueToday > 0}
      />
      <StatsCard
        label="Overdue"
        value={stats.overdue}
        icon={AlertCircle}
        color="text-red-500"
        active={stats.overdue > 0}
        alert
      />
      <StatsCard
        label="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        color="text-green-500"
      />
    </div>
  );
};

// Internal Helper Component
interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  active?: boolean;
  alert?: boolean;
}

const StatsCard = ({
  label,
  value,
  icon: Icon,
  color,
  active,
  alert,
}: StatsCardProps) => (
  <Card
    className={cn(
      "border-l-4 shadow-sm transition-all hover:shadow-md",
      alert && active
        ? "border-l-red-500 bg-red-50/20 dark:bg-red-900/10"
        : active
          ? "border-l-blue-500"
          : "border-l-transparent"
    )}
  >
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>
      <div className={cn("p-2.5 rounded-full bg-muted/50", color)}>
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);
