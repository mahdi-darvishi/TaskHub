import Loader from "@/components/loader";
import { Archive, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";

const AchievedPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
          <Archive className="w-6 h-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Archived Items</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <CheckCheck className="h-8 w-8 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Archived Projects</h3>
              <p className="text-sm text-muted-foreground">
                View completed projects
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <Archive className="h-8 w-8 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Archived Tasks</h3>
              <p className="text-sm text-muted-foreground">
                View archived tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievedPage;
