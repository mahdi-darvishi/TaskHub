import Loader from "@/components/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";

const MyTasksPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // شبیه‌سازی لودینگ دیتا
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
          <ListTodo className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* اینجا بعداً کارت‌های آمار تسک‌های من قرار می‌گیرد */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned to Me
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Pending tasks</p>
          </CardContent>
        </Card>
      </div>

      <div className="min-h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/50">
        <p className="text-muted-foreground">
          My Tasks List Component Will Be Here
        </p>
      </div>
    </div>
  );
};

export default MyTasksPage;
