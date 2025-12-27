import type { Comment, User } from "@/types/indedx"; // مطمئن شو مسیر درسته
import { useState, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  useAddCommentMutation,
  useGetCommentsByTaskIdQuery,
} from "@/hooks/use-task";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Loader from "../loader";

interface ProjectMember {
  _id: string;
  role: string;
  user: User;
}

export const CommentSection = ({
  taskId,
  members,
}: {
  taskId: string;
  members: ProjectMember[];
}) => {
  const [newComment, setNewComment] = useState("");

  // States for Mention Logic
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: addComment, isPending } = useAddCommentMutation();
  const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  // --- Mention Logic ---

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;

    setNewComment(value);
    setCursorPosition(selectionStart);

    const lastAtPos = value.lastIndexOf("@", selectionStart - 1);

    if (lastAtPos !== -1) {
      const textAfterAt = value.slice(lastAtPos + 1, selectionStart);
      const prevChar = value[lastAtPos - 1];
      const isStartOfWord =
        lastAtPos === 0 || prevChar === " " || prevChar === "\n";

      if (!textAfterAt.includes(" ") && isStartOfWord) {
        setMentionQuery(textAfterAt);
        setShowMentions(true);
        return;
      }
    }

    setShowMentions(false);
    setMentionQuery(null);
  };

  const insertMention = (user: User) => {
    if (!textareaRef.current) return;

    const value = newComment;
    const lastAtPos = value.lastIndexOf("@", cursorPosition - 1);

    const beforeMention = value.slice(0, lastAtPos);
    const afterMention = value.slice(cursorPosition);

    const newValue = `${beforeMention}@${user.name} ${afterMention}`;

    setNewComment(newValue);
    setShowMentions(false);
    setMentionQuery(null);

    textareaRef.current.focus();
  };

  const filteredMembers = (members || []).filter((member) =>
    member.user?.name
      ?.toLowerCase()
      .includes((mentionQuery || "").toLowerCase())
  );

  // --- End Mention Logic ---

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(
      { taskId, text: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added successfully");
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to add comment");
          console.log(error);
        },
      }
    );
  };

  const renderCommentWithMentions = (text: string) => {
    if (!members || members.length === 0) return text;

    const memberNames = members
      .map((m) => m.user?.name)
      .filter((n): n is string => !!n)
      .sort((a, b) => b.length - a.length);

    if (memberNames.length === 0) return text;

    const escapeRegExp = (string: string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(@(?:${memberNames.map(escapeRegExp).join("|")}))`,
      "g"
    );

    const parts = text.split(pattern);

    return parts.map((part, index) => {
      if (part.startsWith("@") && memberNames.includes(part.slice(1))) {
        return (
          <span key={index} className="text-blue-500 font-medium">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Comments</h3>

      <ScrollArea className="h-[300px] mb-4">
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 py-2">
              <Avatar className="size-8">
                <AvatarImage
                  className="object-cover"
                  src={comment.author.profilePicture}
                />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {renderCommentWithMentions(comment.text)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No comment yet</p>
          </div>
        )}
      </ScrollArea>

      <Separator className="my-4" />

      <div className="mt-4 relative">
        {/* --- Mention List Popup --- */}
        {showMentions && filteredMembers.length > 0 && (
          <div className="absolute bottom-full mb-2 w-64 bg-popover border rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 text-xs text-muted-foreground border-b bg-muted/50">
              Select a member
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredMembers.map((member) => (
                <button
                  key={member._id}
                  onClick={() => insertMention(member.user)}
                  className="flex items-center gap-2 w-full p-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <Avatar className="size-6">
                    <AvatarImage
                      className="object-cover"
                      src={member.user.profilePicture}
                    />
                    <AvatarFallback>
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{member.user.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Textarea
          ref={textareaRef}
          placeholder="Add a comment (type @ to mention)"
          value={newComment}
          onChange={handleTextareaChange}
          className="min-h-[100px]"
        />

        <div className="flex justify-end mt-4">
          <Button
            disabled={!newComment.trim() || isPending}
            onClick={handleAddComment}
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
