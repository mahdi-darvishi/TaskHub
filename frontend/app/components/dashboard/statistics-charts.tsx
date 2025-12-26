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
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}: StatisticsChartsProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {/* --- Task Trends Chart --- */}
      <Card className="lg:col-span-2 col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-medium">Task Trends</CardTitle>
            <CardDescription>Daily task status changes</CardDescription>
          </div>
          <ChartLine className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] min-w-0">
            <ChartContainer
              className="h-full w-full"
              config={{
                completed: { color: "#10b981" },
                inProgress: { color: "#f59e0b" },
                todo: { color: "#3b82f6" },
              }}
            >
              <LineChart
                data={taskTrendsData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="inProgress"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                {/* ✅ FIX: Changed 'todo' to 'toDo' to match your data */}
                <Line
                  type="monotone"
                  dataKey="toDo"
                  stroke="#6b7280"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Project Status Chart --- */}
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-medium">
              Project Status
            </CardTitle>
            <CardDescription>Project status breakdown</CardDescription>
          </div>
          <ChartPie className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* ✅ FIX: Removed min-w-[350px], added flexible container */}
          <div className="w-full h-[300px] min-w-0">
            <ChartContainer
              className="h-full w-full mx-auto"
              config={{
                Completed: { color: "#10b981" },
                "In Progress": { color: "#3b82f6" },
                Planning: { color: "#f59e0b" },
              }}
            >
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => {
                    if (percent === 0) return null;
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Task Priority Chart --- */}
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-medium">
              Task Priority
            </CardTitle>
            <CardDescription>Task priority breakdown</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] min-w-0">
            <ChartContainer
              className="h-full w-full mx-auto"
              config={{
                High: { color: "#ef4444" },
                Medium: { color: "#f59e0b" },
                Low: { color: "#6b7280" },
              }}
            >
              <PieChart>
                <Pie
                  data={taskPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => {
                    if (percent === 0) return null;
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  labelLine={false}
                >
                  {taskPriorityData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Workspace Productivity Chart --- */}
      <Card className="lg:col-span-2 col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-medium">
              Workspace Productivity
            </CardTitle>
            <CardDescription>Task completion by project</CardDescription>
          </div>
          <ChartBarBig className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] min-w-0">
            <ChartContainer
              className="h-full w-full"
              config={{
                completed: { color: "#3b82f6" },
                total: { color: "red" },
              }}
            >
              <BarChart
                data={workspaceProductivityData}
                barGap={20}
                barSize={60}
                margin={{ bottom: 10 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={true}
                  axisLine={true}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={14}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid strokeDasharray="10 10" vertical={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="total"
                  fill="#000"
                  radius={[4, 4, 0, 0]}
                  name="Total Tasks"
                />
                <Bar
                  dataKey="completed"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Completed Tasks"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
