import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: [
        "TASK_ASSIGNED",
        "TASK_STATUS_CHANGED",
        "TASK_UPDATED",
        "COMMENT_MENTION",
        "PROJECT_INVITE",
        "DEADLINE_APPROACHING",
      ],
      required: true,
    },

    message: { type: String, required: true },

    relatedId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String, enum: ["Task", "Project", "Comment"] },

    isRead: { type: Boolean, default: false },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
