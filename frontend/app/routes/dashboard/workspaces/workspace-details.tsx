import Loader from "@/components/loader";
import { CreateProjectDialog } from "@/components/project/create-project";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { ProjectList } from "@/components/workspace/project-list";
import WorkspaceHeader from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types/indedx";

import { useState } from "react";
import { useParams } from "react-router";

type WorkspaceResponse = {
  workspace: Workspace;
  projects: Project[];
};

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  // Consolidated Query: Cleaned up duplicate hook calls
  const { data, isLoading } = useGetWorkspaceQuery(workspaceId!) as {
    data: WorkspaceResponse;
    isLoading: boolean;
  };

  if (isLoading) return <Loader />;
  if (!workspaceId || !data)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Workspace not found
      </div>
    );

  const { workspace, projects } = data;

  return (
    // Responsive Container with vertical spacing
    <div className="space-y-6 md:space-y-8 w-full max-w-[1600px] mx-auto pb-10">
      {/* Header Section */}
      <WorkspaceHeader
        workspace={workspace}
        members={workspace.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

      {/* Projects List Section */}
      <div className="px-1 md:px-0">
        <ProjectList
          workspaceId={workspaceId}
          projects={projects}
          onCreateProject={() => setIsCreateProject(true)}
        />
      </div>

      {/* Dialogs */}
      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={workspace.members as any}
      />

      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
        inviteCode={workspace.inviteCode as string}
      />
    </div>
  );
};

export default WorkspaceDetails;
