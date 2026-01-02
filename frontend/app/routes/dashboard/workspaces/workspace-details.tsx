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

  const { data: workspaces } = useGetWorkspaceQuery(workspaceId!) as {
    data: WorkspaceResponse;
  };

  if (!workspaceId) return <div>Workspace not found</div>;

  const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data?.workspace.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

      <ProjectList
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members as any}
      />

      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
        inviteCode={workspaces.workspace.inviteCode as string}
      />
    </div>
  );
};

export default WorkspaceDetails;
