export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface TaskType {
  _id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  project?: { name: string; _id: string };
  workspace?: { name: string; _id: string };
  assignees: { _id: string; profilePicture?: string; name: string }[];
}
