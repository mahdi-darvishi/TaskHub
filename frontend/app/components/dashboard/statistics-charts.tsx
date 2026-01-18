import type {
  ProjectStatusData,
  StatsCardProps,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types/indedx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface StatisticsChartsProps {
  stats: StatsCardProps;
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
}

export const StatisticsCharts = ({
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}: StatisticsChartsProps) => {
  // ✅ Fix: Sanitize data to ensure 'name' exists for the BarChart
  const sanitizedProductivityData = workspaceProductivityData.map((item) => ({
    ...item,
    name: item.name || "Unknown Project", // Fallback for missing names
  }));

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-7 mb-8">
      {/* --- Task Trends Chart (Full width on mobile, 4 cols on desktop) --- */}
      <Card className="col-span-1 lg:col-span-4 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Task Trends
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Daily task status changes
            </CardDescription>
          </div>
          <ChartLine className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pl-0">
          <div className="w-full h-[250px] sm:h-[300px]">
            <ChartContainer
              className="h-full w-full"
              config={{
                completed: { color: "#10b981", label: "Completed" },
                inProgress: { color: "#f59e0b", label: "In Progress" },
                toDo: { color: "#3b82f6", label: "To Do" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={taskTrendsData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="var(--color-completed)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="inProgress"
                    stroke="var(--color-inProgress)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="toDo"
                    stroke="var(--color-toDo)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Project Status Chart (3 cols on desktop) --- */}
      <Card className="col-span-1 lg:col-span-3 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Project Status
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Distribution by status
            </CardDescription>
          </div>
          <ChartPie className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ChartContainer
              className="h-full w-full mx-auto"
              config={{
                Completed: { color: "#10b981" },
                "In Progress": { color: "#3b82f6" },
                Planning: { color: "#f59e0b" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend
                    content={
                      <ChartLegendContent className="flex-wrap gap-2 justify-center" />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Workspace Productivity (Full width on mobile, 4 cols) --- */}
      <Card className="col-span-1 lg:col-span-4 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Productivity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Completion by project
            </CardDescription>
          </div>
          <ChartBarBig className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pl-0">
          <div className="w-full h-[250px] sm:h-[300px]">
            <ChartContainer
              className="h-full w-full"
              config={{
                completed: { color: "#3b82f6", label: "Completed" },
                total: { color: "#e5e7eb", label: "Total Tasks" }, // Muted color for total
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sanitizedProductivityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  barSize={32}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    interval={0} // Show all labels
                    // Function to truncate long names on X axis
                    tickFormatter={(value) =>
                      value.length > 10 ? `${value.substring(0, 10)}...` : value
                    }
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <ChartTooltip
                    cursor={{ fill: "transparent" }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[4, 4, 0, 0]}
                    stackId="a" // Optional: Stack them or keep side-by-side. Side-by-side is usually better for comparison
                  />
                  <Bar
                    dataKey="completed"
                    fill="var(--color-completed)"
                    radius={[4, 4, 0, 0]}
                    // stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Task Priority (3 cols) --- */}
      <Card className="col-span-1 lg:col-span-3 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Task Priority
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Workload by priority
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ChartContainer
              className="h-full w-full mx-auto"
              config={{
                High: { color: "#ef4444" },
                Medium: { color: "#f59e0b" },
                Low: { color: "#6b7280" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskPriorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {taskPriorityData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend
                    content={
                      <ChartLegendContent className="flex-wrap gap-2 justify-center" />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
