import { RecentProjects } from "@/components/dashboard/recnet-projects";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import StatsCard from "@/components/dashboard/stats-card";
import Loader from "@/components/loader";
import { NoDataFound } from "@/components/no-data-found";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import { useWorkspace } from "@/provider/workspace-provider";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types/indedx";
import { Briefcase } from "lucide-react";
import { useNavigate, type MetaFunction } from "react-router";
export const meta: MetaFunction = () => {
  return [{ title: "TaskHub - Dashboard Overview" }];
};

const Dashboard = () => {
  const { activeWorkspace } = useWorkspace();
  const workspaceId = activeWorkspace?._id;
  const navigate = useNavigate();

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  if (!workspaceId) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center min-h-[500px]">
        <NoDataFound
          title="No Workspace Selected"
          description="You currently don't have an active workspace. Please select one or create a new one."
          buttonText="Go to Workspaces"
          buttonAction={() => navigate("/workspaces")}
          icon={Briefcase}
        />
      </div>
    );
  }

  if (isPending) return <Loader />;

  // Safe check for completed projects count
  const completedProjectsCount =
    data.workspaceProductivityData.length > 0
      ? data.workspaceProductivityData.reduce(
          (acc, curr) => acc + curr.completed,
          0,
        ) // Sum all completed
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-[1600px] mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your workspace activity.
          </p>
        </div>
        <div className="bg-muted/50 px-4 py-2 rounded-lg border shadow-sm self-start sm:self-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              {completedProjectsCount}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Task completed
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCard data={data.stats} />

      {/* Charts Section */}
      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      {/* Lists Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
