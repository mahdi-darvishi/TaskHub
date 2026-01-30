import { fetchData } from "@/lib/fetch-util";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";
import type { ActivityLog } from "@/types/indedx";
import { getActivityIcon } from "./task-icon";
import { formatDistanceToNow } from "date-fns";

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => fetchData(`/tasks/${resourceId}/activity`),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
  };

  if (isPending)
    return (
      <div className="flex justify-center p-4">
        <Loader />
      </div>
    );

  return (
    <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-muted-foreground">Activity</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {data?.length || 0}
        </span>
      </div>

      <div className="space-y-4 max-h-[350px] sm:max-h-[375px] overflow-y-auto pr-2 custom-scrollbar">
        {!data || data.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No activity recorded yet.
          </p>
        ) : (
          data.map((activity) => (
            <div key={activity._id} className="flex gap-3 group">
              <div className="size-8 min-w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                {getActivityIcon(activity.action)}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm leading-snug wrap-break-word">
                  <span className="font-semibold text-foreground">
                    {activity.user.name}
                  </span>{" "}
                  <span className="text-muted-foreground font-normal">
                    {activity.details?.description || "updated the task"}
                  </span>
                </p>

                <span className="text-[10px] sm:text-xs text-muted-foreground/60">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
