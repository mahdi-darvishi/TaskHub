import { recordActivity } from "../libs/index.js";
import ActivityLog from "../models/activity.js";
import Comment from "../models/comment.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";
import { createNotification } from "../libs/notification-helper.js";
import Notification from "../models/notification.js";

import { io, getReceiverSocketId } from "../socket/socket.js";
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      description,
      status = "To Do",
      priority = "Medium",
      dueDate,
      assignees = [],
      tags = [],
      estimatedHours,
    } = req.body;

    const userId = req.user._id;

    // 1. Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Find the workspace
    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // 3. Check membership
    const isMember = workspace.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // 4. Validate Assignees
    if (assignees.length > 0) {
      const validMembers = workspace.members.map((m) => m.user.toString());
      const allAssigneesValid = assignees.every((assigneeId) =>
        validMembers.includes(assigneeId.toString())
      );

      if (!allAssigneesValid) {
        return res.status(400).json({
          message: "One or more assignees are not members of this workspace.",
        });
      }
    }

    // 5. Calculate Order
    const lastTask = await Task.findOne({
      project: projectId,
      status: status,
    })
      .sort({ order: -1 })
      .select("order");

    const newOrder = lastTask ? lastTask.order + 1 : 0;

    // 6. Create the Task
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      tags,
      estimatedHours,
      project: projectId,
      workspace: workspace._id,
      createdBy: userId,
      order: newOrder,
    });

    await newTask.save();

    // 7. Add reference to Project
    project.tasks.push(newTask._id);
    await project.save();

    // 8. Populate data immediately (Needed for Frontend & Socket)
    const populatedTask = await newTask.populate([
      { path: "assignees", select: "name profilePicture email" },
      { path: "createdBy", select: "name profilePicture" },
    ]);

    // --- 🔥 Socket & Notification Logic ---

    // A: Send Notifications to Assignees
    if (assignees && assignees.length > 0) {
      // Don't notify the creator if they assigned themselves
      const recipients = assignees.filter(
        (id) => id.toString() !== userId.toString()
      );

      if (recipients.length > 0) {
        const notificationsData = recipients.map((recipientId) => ({
          recipient: recipientId,
          sender: userId,
          type: "TASK_ASSIGNED",
          message: `${req.user.name} assigned you to task: ${newTask.title}`,
          isRead: false,
          relatedId: newTask._id,
          relatedModel: "Task",
          workspaceId: workspace._id,
          projectId: projectId,
        }));

        const createdNotifications = await Notification.insertMany(
          notificationsData
        );

        // Emit Socket Event for Notification
        createdNotifications.forEach((notification) => {
          const receiverSocketId = getReceiverSocketId(
            notification.recipient.toString()
          );
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", {
              ...notification.toObject(),
              sender: {
                _id: req.user._id,
                name: req.user.name,
                profilePicture: req.user.profilePicture,
              },
            });
          }
        });
      }
    }

    // B: Broadcast New Task to ALL Project Members (For Live Board Update)
    // This allows other users viewing the project to see the new task instantly
    if (project.members && project.members.length > 0) {
      project.members.forEach((member) => {
        // Skip sender (they already have the data via API response)
        if (member.user.toString() !== userId.toString()) {
          const memberSocketId = getReceiverSocketId(member.user.toString());
          if (memberSocketId) {
            // We send the full populated task so it can be added to the Redux/State/Query cache
            io.to(memberSocketId).emit("taskCreated", populatedTask);
          }
        }
      });
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("assignees", "name profilePicture")
      .populate("watchers", "name profilePicture");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project).populate(
      "members.user",
      "name profilePicture"
    );

    res.status(200).json({ task, project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskTitle = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const oldTitle = task.title;

    task.title = title;
    await task.save();

    // record activity
    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `updated task title from ${oldTitle} to ${title}`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const updateTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const oldDescription =
      task.description.substring(0, 50) +
      (task.description.length > 50 ? "..." : "");
    const newDescription =
      description.substring(0, 50) + (description.length > 50 ? "..." : "");

    task.description = description;
    await task.save();

    // record activity
    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `updated task description from ${oldDescription} to ${newDescription}`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    const oldStatus = task.status;

    // Update status
    task.status = status;
    await task.save();

    // --- Notification Logic ---

    // 1. Identify Recipients (Assignees + Creator)
    // Using Set to avoid duplicates if creator is also an assignee
    const recipientIds = new Set(task.assignees.map((id) => id.toString()));
    if (task.createdBy) {
      recipientIds.add(task.createdBy.toString());
    }

    // Convert back to array and remove the current user (sender)
    const finalRecipients = Array.from(recipientIds).filter(
      (id) => id !== userId.toString()
    );

    if (finalRecipients.length > 0) {
      // 2. Prepare Notification Objects
      const notificationsData = finalRecipients.map((recipientId) => ({
        recipient: recipientId,
        sender: userId,
        type: "TASK_STATUS_CHANGED",
        message: `${req.user.name} changed task status to ${status}`, // Fixed: Defined message
        isRead: false,
        relatedId: task._id,
        relatedModel: "Task",
        workspaceId: task.workspace, // ✅ Vital for navigation
        projectId: task.project, // ✅ Vital for navigation
      }));

      // 3. Save to Database (Batch Insert)
      const createdNotifications = await Notification.insertMany(
        notificationsData
      );

      // 4. 🔥 Socket Emission
      createdNotifications.forEach((notification) => {
        const receiverSocketId = getReceiverSocketId(
          notification.recipient.toString()
        );

        if (receiverSocketId) {
          // A: Send Notification Popup
          io.to(receiverSocketId).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              _id: req.user._id,
              name: req.user.name,
              profilePicture: req.user.profilePicture,
            },
          });

          // B: Update Task Board Real-time (Optional but recommended)
          // This tells the frontend to update this specific task card without refresh
          io.to(receiverSocketId).emit("taskUpdated", task);
        }
      });
    }

    // record activity
    await recordActivity(userId, "updated_task", "Task", taskId, {
      description: `updated task status from ${oldStatus} to ${status}`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Not a member" });

    const oldAssigneeIds = task.assignees.map((id) => id.toString());

    // Update DB
    task.assignees = assignees;
    await task.save();

    // Populate immediately for response and socket
    const populatedTask = await task.populate(
      "assignees",
      "name profilePicture email"
    );

    // --- Socket & Notification Logic ---

    // A. Handle Notifications for NEW Assignees
    const newlyAddedMembers = assignees.filter(
      (id) => !oldAssigneeIds.includes(id)
    );

    if (newlyAddedMembers.length > 0) {
      const recipients = newlyAddedMembers.filter(
        (id) => id !== userId.toString()
      );

      if (recipients.length > 0) {
        const notificationsData = recipients.map((recipientId) => ({
          recipient: recipientId,
          sender: userId,
          type: "TASK_ASSIGNED",
          message: `${req.user.name} assigned you to task: ${task.title}`,
          isRead: false,
          relatedId: task._id,
          relatedModel: "Task",
          workspaceId: task.workspace, // ✅ Added for navigation
          projectId: task.project, // ✅ Added for navigation
        }));

        const createdNotifications = await Notification.insertMany(
          notificationsData
        );

        // Emit Notification Event
        createdNotifications.forEach((notification) => {
          const receiverSocketId = getReceiverSocketId(
            notification.recipient.toString()
          );
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", {
              ...notification.toObject(),
              sender: {
                _id: req.user._id,
                name: req.user.name,
                profilePicture: req.user.profilePicture,
              },
            });
          }
        });
      }
    }

    // B. Real-time Task Update for ALL Project Members
    // (So the user icon appears on the task card immediately for everyone)
    if (project.members.length > 0) {
      project.members.forEach((member) => {
        // Skip sender (they got the response via API)
        if (member.user.toString() !== userId.toString()) {
          const socketId = getReceiverSocketId(member.user.toString());
          if (socketId) {
            io.to(socketId).emit("taskUpdated", populatedTask);
          }
        }
      });
    }

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `updated assignees`,
    });

    res.status(200).json(populatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const oldPriority = task.priority;

    task.priority = priority;
    await task.save();

    // record activity
    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `updated task priority from ${oldPriority} to ${priority}`,
    });
    if (priority === "High" && oldPriority !== "High") {
      const message = `🚨 Priority of '${task.title}' changed to HIGH by ${req.user.name}`;

      if (task.assignees && task.assignees.length > 0) {
        task.assignees.forEach(async (assigneeId) => {
          // به خود تغییر دهنده نفرست
          if (assigneeId.toString() !== req.user._id.toString()) {
            await createNotification({
              recipient: assigneeId,
              sender: req.user._id,
              type: "TASK_UPDATED",
              message: message,
              relatedId: task._id,
              relatedModel: "Task",
              workspace: task.workspace,
            });
          }
        });
      }
    }
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, date, tag } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // ساخت ساب‌تسک جدید
    const newSubTask = {
      title,
      date,
      tag,
      isCompleted: false,
    };

    task.subTasks.push(newSubTask);
    await task.save();

    // برای محاسبه دقیق و ارسال به فرانت، دوباره Populate میکنیم
    const populatedTask = await task.populate(
      "assignees",
      "name profilePicture email"
    );

    // --- 🔥 Socket Logic ---

    // A: ارسال نوتیفیکیشن به اعضای تسک
    const recipients = task.assignees
      .map((u) => u._id.toString())
      .filter((id) => id !== userId.toString());

    if (recipients.length > 0) {
      // 1. ذخیره نوتیفیکیشن
      const notificationsData = recipients.map((recipientId) => ({
        recipient: recipientId,
        sender: userId,
        type: "SUBTASK_ADDED", // تایپ جدید
        message: `${req.user.name} added a subtask: ${title}`,
        isRead: false,
        relatedId: task._id,
        relatedModel: "Task",
        workspaceId: task.workspace,
        projectId: task.project,
      }));

      const createdNotifications = await Notification.insertMany(
        notificationsData
      );

      // 2. ارسال پاپ‌آپ (نوتیفیکیشن)
      createdNotifications.forEach((notification) => {
        const socketId = getReceiverSocketId(notification.recipient.toString());
        if (socketId) {
          io.to(socketId).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              _id: req.user._id,
              name: req.user.name,
              profilePicture: req.user.profilePicture,
            },
          });
        }
      });
    }

    // B: آپدیت ریل‌تایم تسک (برای تغییر تعداد ساب‌تسک‌ها در بورد)
    if (project.members.length > 0) {
      project.members.forEach((member) => {
        if (member.user.toString() !== userId.toString()) {
          const socketId = getReceiverSocketId(member.user.toString());
          if (socketId) {
            // این باعث میشه تسک توی بورد همه آپدیت بشه
            io.to(socketId).emit("taskUpdated", populatedTask);
          }
        }
      });
    }

    res.status(200).json(populatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { isCompleted } = req.body; // یا هر فیلدی که آپدیت میشه

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // پیدا کردن و آپدیت ساب‌تسک
    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) return res.status(404).json({ message: "Subtask not found" });

    subTask.isCompleted = isCompleted;
    await task.save();

    const populatedTask = await task.populate(
      "assignees",
      "name profilePicture email"
    );

    // --- 🔥 Socket Logic ---
    // اینجا فقط تسک را آپدیت می‌کنیم تا نوار پیشرفت برای همه تکان بخورد
    // معمولاً برای تیک زدن نوتیفیکیشن نمی‌فرستند (چون اسپم میشه)، اما ریل‌تایم ضروریه

    const project = await Project.findById(task.project);
    if (project && project.members.length > 0) {
      project.members.forEach((member) => {
        // به خود ارسال کننده هم میفرستیم یا نه؟ معمولا نه چون UI خودش آپدیت کرده
        // ولی برای اطمینان به همه غیر از فرستنده میفرستیم
        if (member.user.toString() !== req.user._id.toString()) {
          const socketId = getReceiverSocketId(member.user.toString());
          if (socketId) {
            io.to(socketId).emit("taskUpdated", populatedTask);
          }
        }
      });
    }

    res.status(200).json(populatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getActivityByResourceId = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const activity = await ActivityLog.find({ resourceId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(activity);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCommentsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text, mentionedUserIds } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Not a member" });

    // Create Comment
    const newComment = await Comment.create({
      text,
      task: taskId,
      author: userId,
    });

    task.comments.push(newComment._id);
    await task.save();

    // Populate immediately
    const populatedComment = await newComment.populate(
      "author",
      "name profilePicture"
    );

    // --- Socket & Notification Logic ---

    // A. Handle Mentions
    if (mentionedUserIds && mentionedUserIds.length > 0) {
      const recipients = mentionedUserIds.filter(
        (id) => id.toString() !== userId.toString()
      );

      if (recipients.length > 0) {
        const notificationsData = recipients.map((recipientId) => ({
          recipient: recipientId,
          sender: userId,
          type: "COMMENT_MENTION",
          message: `${req.user.name} mentioned you in a comment`,
          isRead: false,
          relatedId: task._id,
          relatedModel: "Task",
          workspaceId: task.workspace, // ✅ Added
          projectId: task.project, // ✅ Added
        }));

        const createdNotifications = await Notification.insertMany(
          notificationsData
        );

        // Emit Notification
        createdNotifications.forEach((notification) => {
          const receiverSocketId = getReceiverSocketId(
            notification.recipient.toString()
          );
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", {
              ...notification.toObject(),
              sender: {
                _id: req.user._id,
                name: req.user.name,
                profilePicture: req.user.profilePicture,
              },
            });
          }
        });
      }
    }

    // B. Real-time Comment Update (Chat style)
    // Send the new comment to everyone in the project so it appears instantly
    if (project.members.length > 0) {
      project.members.forEach((member) => {
        // Skip sender (they have it via API response)
        if (member.user.toString() !== userId.toString()) {
          const socketId = getReceiverSocketId(member.user.toString());
          if (socketId) {
            io.to(socketId).emit("newComment", {
              comment: populatedComment,
              taskId: taskId,
            });
          }
        }
      });
    }

    await recordActivity(userId, "added_comment", "Task", taskId, {
      description: `added comment: ${
        text.substring(0, 30) + (text.length > 30 ? "..." : "")
      }`,
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const watchTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const isWatching = task.watchers.includes(req.user._id);

    if (!isWatching) {
      task.watchers.push(req.user._id);
    } else {
      task.watchers = task.watchers.filter(
        (watcher) => watcher.toString() !== req.user._id.toString()
      );
    }

    await task.save();

    // record activity
    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `${
        isWatching ? "stopped watching" : "started watching"
      } task ${task.title}`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const achievedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }
    const isAchieved = task.isArchived;

    task.isArchived = !isAchieved;
    await task.save();

    // record activity
    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `${isAchieved ? "unachieved" : "achieved"} task ${
        task.title
      }`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { workspaceId, projectId, status, priority, search } = req.query;

    // 1. Base query: Find tasks assigned to the user
    const query = {
      assignees: userId, // Assuming 'assignees' is an array of user IDs
    };

    // 2. Apply Filters if they exist
    if (workspaceId) query.workspace = workspaceId;
    if (projectId) query.project = projectId;
    if (status && status !== "ALL") query.status = status;
    if (priority && priority !== "ALL") query.priority = priority;

    // 3. Apply Search (Case insensitive regex)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 4. Execute Query with Sorting (Due date ascending is usually best for tasks)
    const tasks = await Task.find(query)
      .populate("project", "name emoji") // Get project details
      .populate("workspace", "name") // Get workspace details
      .populate("assignees", "name profilePicture") // Get assignees details
      .sort({ dueDate: 1, createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get My Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { workspaceId, projectId, taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findOne({
      _id: projectId,
      workspace: workspaceId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete from DB
    await Task.deleteOne({ _id: taskId });

    // Remove task reference from project array if exists
    // (Optional logic depending on your schema, but good practice)
    await Project.findByIdAndUpdate(projectId, {
      $pull: { tasks: taskId },
    });

    // --- Socket Logic ---
    // Broadcast "taskDeleted" to all project members so it disappears from their board
    if (project.members && project.members.length > 0) {
      project.members.forEach((member) => {
        // We notify everyone, including the sender (if they have multiple tabs open)
        const socketId = getReceiverSocketId(member.user.toString());
        if (socketId) {
          io.to(socketId).emit("taskDeleted", taskId); // Send ID to remove from UI state
        }
      });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -
export {
  createTask,
  getTaskById,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskStatus,
  updateTaskAssignees,
  updateTaskPriority,
  addSubTask,
  updateSubTask,
  getActivityByResourceId,
  getCommentsByTaskId,
  addComment,
  watchTask,
  achievedTask,
  getMyTasks,
  deleteTask,
};
