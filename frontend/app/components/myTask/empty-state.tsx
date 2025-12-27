import { CheckCircle2 } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed rounded-xl bg-muted/10 mx-auto w-full max-w-2xl mt-10">
      <div className="p-4 rounded-full bg-muted mb-4">
        <CheckCircle2 className="w-12 h-12 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold">All caught up!</h3>
      <p className="text-muted-foreground max-w-sm mt-2">
        You have no tasks matching your filters. Take a break or create a new
        task in your projects.
      </p>
    </div>
  );
};
