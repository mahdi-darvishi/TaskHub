import mongoose from "mongoose";

const workspaceInviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    inviterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, //
    token: { type: String, required: true, unique: true },
    role: { type: String, default: "member", enum: ["admin", "member"] },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

workspaceInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const WorkspaceInvite = mongoose.model(
  "WorkspaceInvite",
  workspaceInviteSchema
);

export default WorkspaceInvite;
