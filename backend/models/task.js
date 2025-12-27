import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // ✅ فیلد ضروری برای رفع ارور و فیلتر کردن
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true, // برای سرعت بیشتر در جستجو
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
      enum: ["Low", "Medium", "High", "Urgent"], // Urgent اضافه شد
      default: "Medium",
    },

    // ✅ برای ترتیب در Drag & Drop (Kanban Board)
    order: {
      type: Number,
      default: 0,
    },

    // ✅ شناسه کوتاه و خوانا مثل "TASK-102" (اختیاری ولی حرفه‌ای)
    taskKey: {
      type: String,
      trim: true,
    },

    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    watchers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // تاریخ‌ها
    dueDate: { type: Date },
    startDate: { type: Date }, // تاریخ شروع (جدید)
    completedAt: { type: Date },

    // زمان‌بندی و گزارش کار
    estimatedHours: { type: Number, min: 0, default: 0 },
    actualHours: { type: Number, min: 0, default: 0 },

    tags: [{ type: String }],

    // زیرتسک‌ها (Embedded)
    subtasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // وابستگی‌ها: این تسک منتظر چه تسک‌هایی است؟
    dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],

    // ارجاع به کامنت‌ها (بهتر است کالکشن جدا باشد که هست)
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

    // فیلد برای حذف منطقی (Soft Delete) به جای حذف کامل
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ایندکس ترکیبی برای پرفورمنس بالا در کوئری‌های متداول
taskSchema.index({ workspace: 1, project: 1, status: 1 });
taskSchema.index({ assignees: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
