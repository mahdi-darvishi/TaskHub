import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Notification from "../models/notification.js";
import sendEmail from "../libs/send-email.js";
import { getWorkspaceInvitationTemplate } from "../libs/emailTemplates.js";
const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // اول ورک‌اسپیس را می‌گیریم
    let workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (!workspace.inviteCode) {
      workspace.inviteCode =
        Math.random().toString(36).substring(2, 8) +
        Math.random().toString(36).substring(2, 8);
      await workspace.save();
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      members: { $elemMatch: { user: req.user._id } },
    }).populate("tasks", "status");
    // .sort({ createdAt: -1 });

    res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate project updatedAt isArchived priority"
        )
        .sort({ createdAt: -1 }),
    ]);

    const totalTasks = projects.reduce((acc, project) => {
      return acc + project.tasks.length;
    }, 0);

    const totalProjectInProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;
    // const totalProjectCompleted = projects.filter(
    //   (project) => project.status === "Completed"
    // ).length;

    const totalTaskCompleted = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "Done").length
      );
    }, 0);

    const totalTaskToDo = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "To Do").length
      );
    }, 0);

    const totalTaskInProgress = projects.reduce((acc, project) => {
      return (
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length
      );
    }, 0);

    const tasks = projects.flatMap((project) => project.tasks);

    // get upcoming task in next 7 days

    const upcomingTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return (
        taskDate > today &&
        taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    const taskTrendsData = [
      { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
    ];

    // get last 7 days tasks date
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // populate

    for (const project of projects) {
      for (const task of project.tasks) {
        const taskDate = new Date(task.updatedAt);

        const dayInDate = last7Days.findIndex(
          (date) =>
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear()
        );

        if (dayInDate !== -1) {
          const dayName = last7Days[dayInDate].toLocaleDateString("en-US", {
            weekday: "short",
          });

          const dayData = taskTrendsData.find((day) => day.name === dayName);

          if (dayData) {
            switch (task.status) {
              case "Done":
                dayData.completed++;
                break;
              case "In Progress":
                dayData.inProgress++;
                break;
              case "To Do":
                dayData.toDo++;
                break;
            }
          }
        }
      }
    }

    // get project status distribution
    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value++;
          break;
        case "In Progress":
          projectStatusData[1].value++;
          break;
        case "Planning":
          projectStatusData[2].value++;
          break;
      }
    }

    // Task priority distribution
    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const task of tasks) {
      switch (task.priority) {
        case "High":
          taskPriorityData[0].value++;
          break;
        case "Medium":
          taskPriorityData[1].value++;
          break;
        case "Low":
          taskPriorityData[2].value++;
          break;
      }
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTask = tasks.filter(
        (task) => task.project.toString() === project._id.toString()
      );

      const completedTask = projectTask.filter(
        (task) => task.status === "Done" && task.isArchived === false
      );

      workspaceProductivityData.push({
        name: project.title,
        completed: completedTask.length,
        total: projectTask.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectInProgress,
      totalTaskCompleted,
      totalTaskToDo,
      totalTaskInProgress,
    };

    res.status(200).json({
      stats,
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    // 1. Find the workspace
    const workspace = await Workspace.findById(workspaceId);

    // 2. Check if it exists
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 3. Check Ownership
    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this workspace. Only the owner can delete it.",
      });
    }

    await Task.deleteMany({ workspace: workspaceId });

    await Project.deleteMany({ workspace: workspaceId });

    await Notification.deleteMany({ workspaceId: workspaceId });

    // -----------------------------------------------------

    await workspace.deleteOne();

    res.status(200).json({
      message: "Workspace and all related projects/tasks deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const inviteUserByEmail = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isRequesterMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isRequesterMember) {
      return res
        .status(403)
        .json({ message: "Access denied. You are not a member." });
    }

    const userToInvite = await User.findOne({ email });
    if (userToInvite) {
      const isAlreadyMember = workspace.members.some(
        (m) => m.user.toString() === userToInvite._id.toString()
      );
      if (isAlreadyMember) {
        return res
          .status(400)
          .json({ message: "User is already a member of this workspace" });
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteLink = `${frontendUrl}/workspaces/join/${workspace._id}/${workspace.inviteCode}`;

    const emailHtml = getWorkspaceInvitationTemplate({
      inviterName: req.user.name,
      workspaceName: workspace.name,
      role: role || "member",
      inviteLink: inviteLink,
    });

    await sendEmail({
      to: email,
      subject: `Invitation to join ${workspace.name} on TaskHub`,
      html: emailHtml, // استفاده از HTML تولید شده
    });

    res.status(200).json({ message: `Invitation sent to ${email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send invitation" });
  }
};

const joinWorkspace = async (req, res) => {
  try {
    const { workspaceId, inviteCode } = req.body;
    const userId = req.user._id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.inviteCode !== inviteCode) {
      return res
        .status(400)
        .json({ message: "Invalid or expired invite link" });
    }

    const isAlreadyMember = workspace.members.some(
      (m) => m.user.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      return res.status(200).json({
        message: "You are already a member",
        workspaceId: workspace._id,
      });
    }

    workspace.members.push({
      user: userId,
      role: "member",
      joinedAt: new Date(),
    });

    workspace.markModified("members");

    await workspace.save();

    res.status(200).json({
      message: "Joined workspace successfully",
      workspaceId: workspace._id,
    });
  } catch (error) {
    console.error("Join Workspace Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(workspace.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  deleteWorkspace,
  inviteUserByEmail,
  joinWorkspace,
  getWorkspaceMembers,
};
