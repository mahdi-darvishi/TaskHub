import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";

const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [newTitle, setNewTitle] = useState(title);

  const { mutate, isPending } = useUpdateTaskTitleMutation();
  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Task title updated successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response.data.message || "Failed to update task title";
          toast.error(errorMessage);
        },
      }
    );

    setIsEditing(false);
  };
  return (
    <div className="inline-flex items-center gap-2 ">
      {isEditing ? (
        <Input
          className=" font-semibold w-full lg:min-w-xs "
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className=" text-xl flex-1 font-semibold">{title}</h2>
      )}

      {isEditing ? (
        <Button
          className="py-0 "
          size={"sm"}
          onClick={updateTitle}
          disabled={isPending}
        >
          Save
        </Button>
      ) : (
        <Edit
          className="size-3 cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default TaskTitle;
