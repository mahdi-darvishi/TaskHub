import type { Comment, User } from "@/types/indedx"; // مسیر تایپ‌ها رو چک کن
import { useState, useRef, useEffect } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/provider/socket-context";

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

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); //

  // Hooks
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { mutate: addComment, isPending } = useAddCommentMutation();

  const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (data: { comment: Comment; taskId: string }) => {
      if (data.taskId === taskId) {
        queryClient.setQueryData(
          ["comments", taskId],
          (oldData: Comment[] | undefined) => {
            if (!oldData) return [data.comment];
            const exists = oldData.find((c) => c._id === data.comment._id);
            if (exists) return oldData;
            return [...oldData, data.comment];
          }
        );

        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [socket, taskId, queryClient]);

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

    const mentionedUserIds = members
      .filter((member) => newComment.includes(`@${member.user.name}`))
      .map((member) => member.user._id);

    addComment(
      {
        taskId,
        text: newComment,
        mentionedUserIds,
      },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added successfully");
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
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
      <div className="flex justify-center p-4">
        <Loader />
      </div>
    );

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Comments</h3>

      <ScrollArea className="h-[300px] mb-4 pr-4">
        {comments?.length > 0 ? (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4 py-2">
                <Avatar className="size-8 mt-1">
                  <AvatarImage
                    className="object-cover"
                    src={comment.author.profilePicture}
                  />
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 bg-accent/30 p-3 rounded-lg">
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
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {renderCommentWithMentions(comment.text)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 h-full">
            <p className="text-sm text-muted-foreground">No comments yet</p>
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
          className="min-h-[100px] resize-none"
        />

        <div className="flex justify-end mt-4">
          <Button
            disabled={!newComment.trim() || isPending}
            onClick={handleAddComment}
          >
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};
