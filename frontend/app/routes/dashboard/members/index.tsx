import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";

const MembersPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="bg-muted p-4 rounded-full">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Workspace Members</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Manage who has access to this workspace. You can invite new members or
          change roles here.
        </p>
      </div>
    </div>
  );
};

export default MembersPage;
