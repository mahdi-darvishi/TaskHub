import Loader from "@/components/loader";
import { Settings, Sliders } from "lucide-react";
import { useEffect, useState } from "react";
// در آینده کامپوننت حذف ورک‌اسپیس را اینجا ایمپورت میکنی
// import WorkspaceSettings from "@/components/workspace/workspace-settings";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
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
    <div className="space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
          <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sliders className="w-5 h-5" />
          <h2>General Settings</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Workspace configuration options will appear here.
        </p>

        {/* Placeholder for settings content */}
        <div className="h-32 bg-muted/30 rounded-lg border border-dashed flex items-center justify-center">
          <span className="text-muted-foreground">Settings Form Component</span>
        </div>
      </div>

      {/* اینجا بعدا کامپوننت حذف ورک اسپیس که قبلا ساختیم رو میاری */}
      {/* <div className="mt-10">
         <WorkspaceSettings />
      </div> */}
    </div>
  );
};

export default SettingsPage;
