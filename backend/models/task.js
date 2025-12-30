import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Done"],
      default: "To Do",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    order: {
      type: Number,
      default: 0,
    },

    taskKey: {
      type: String,
      trim: true,
    },

    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    watchers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    dueDate: { type: Date },
    startDate: { type: Date },
    completedAt: { type: Date },

    estimatedHours: { type: Number, min: 0, default: 0 },
    actualHours: { type: Number, min: 0, default: 0 },

    tags: [{ type: String }],

    subtasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],

    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    isDeleted: { type: Boolean, default: false },

    isArchived: { type: Boolean, default: false },
    archivedAt: { type: Date }, // تاریخ آرشیو شدن
    archivedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

taskSchema.index({ workspace: 1, project: 1, status: 1 });
taskSchema.index({ assignees: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
