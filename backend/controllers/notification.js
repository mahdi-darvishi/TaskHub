import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notificationsData = await Notification.find({
      recipient: req.user._id,
    })
      .populate("sender", "name profilePicture")
      .populate({
        path: "relatedId",
        select: "workspace project", // فقط فیلدهای مورد نیاز را می‌گیریم
      })
      .sort({ createdAt: -1 });

    const notifications = notificationsData.map((note) => {
      let workspaceId = null;
      let projectId = null;

      const noteObj = note.toObject();

      if (note.relatedId) {
        if (note.relatedModel === "Task") {
          workspaceId = note.relatedId.workspace;
          projectId = note.relatedId.project;
        } else if (note.relatedModel === "Project") {
          workspaceId = note.relatedId.workspace;
          projectId = note.relatedId._id;
        }
      }

      return {
        ...noteObj,
        relatedId: note.relatedId ? note.relatedId._id : null,
        workspaceId, // ✅ اضافه شد
        projectId, // ✅ اضافه شد
      };
    });

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === "all") {
      await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
      );
    } else {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    }

    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};
