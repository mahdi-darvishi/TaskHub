import { RecentProjects } from "@/components/dashboard/recnt-projects";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import StatsCard from "@/components/dashboard/stats-card";
import Loader from "@/components/loader";
import { NoDataFound } from "@/components/no-data-found";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
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
import { useNavigate, useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
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
      <div className="p-6 h-full flex flex-col">
        <NoDataFound
          title="No Workspace Selected"
          description="You currently don't have an active workspace. To manage projects and tasks, please select an existing workspace or create a new one."
          buttonText="Go to Workspaces"
          buttonAction={() => navigate("/workspaces")}
          icon={Briefcase}
        />
      </div>
    );
  }
  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>
          {data.workspaceProductivityData.map((item) => (
            <p key={item.name}>{item.name}</p>
          ))}
        </p>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
