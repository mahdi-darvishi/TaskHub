import type { Comment, User } from "@/types/indedx";
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
import { Send, MessageSquare } from "lucide-react"; // اضافه کردن آیکون‌ها
import { cn } from "@/lib/utils";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { mutate: addComment, isPending } = useAddCommentMutation();

  const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  // Auto-scroll to bottom on load and new comments
  useEffect(() => {
    if (comments?.length) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [comments?.length]);

  // Socket Logic
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
          },
        );
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

    // Focus back and set cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = lastAtPos + user.name.length + 2; // @ + name + space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const filteredMembers = (members || []).filter((member) =>
    member.user?.name
      ?.toLowerCase()
      .includes((mentionQuery || "").toLowerCase()),
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
          toast.success("Comment posted");
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to add comment");
        },
      },
    );
  };

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleAddComment();
    }
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
      "g",
    );

    const parts = text.split(pattern);

    return parts.map((part, index) => {
      if (part.startsWith("@") && memberNames.includes(part.slice(1))) {
        return (
          <span
            key={index}
            className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-1 rounded-sm"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader />
      </div>
    );

  return (
    <div className="bg-card rounded-xl border shadow-sm flex flex-col h-full">
      <div className="p-4 sm:p-6 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="size-5" />
          Comments
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground ml-auto">
            {comments?.length || 0}
          </span>
        </h3>
      </div>

      <ScrollArea
        className="flex-1 h-[250px] sm:h-[350px] p-4"
        ref={scrollAreaRef}
      >
        {comments && comments.length > 0 ? (
          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 group">
                <Avatar className="size-8 sm:size-9 shrink-0 mt-1">
                  <AvatarImage
                    className="object-cover"
                    src={comment.author.profilePicture}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg rounded-tl-none text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {renderCommentWithMentions(comment.text)}
                  </div>
                </div>
              </div>
            ))}
            {/* Invisible div for auto-scroll */}
            <div ref={scrollRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-2">
            <div className="bg-muted/30 p-3 rounded-full">
              <MessageSquare className="size-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the conversation!
            </p>
          </div>
        )}
      </ScrollArea>

      <div className="p-3 sm:p-4 bg-muted/10 border-t relative">
        {/* --- Mention List Popup --- */}
        {showMentions && filteredMembers.length > 0 && (
          <div className="absolute bottom-full left-2 right-2 sm:left-4 sm:right-auto mb-2 w-auto sm:w-64 bg-popover border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/50">
              Mention a member
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredMembers.map((member) => (
                <button
                  key={member._id}
                  onClick={() => insertMention(member.user)}
                  className="flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <Avatar className="size-6">
                    <AvatarImage
                      className="object-cover"
                      src={member.user.profilePicture}
                    />
                    <AvatarFallback className="text-[10px]">
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{member.user.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Write a comment... (@ to mention)"
            value={newComment}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            className="min-h-20 sm:min-h-[100px] resize-none bg-background focus-visible:ring-1"
          />

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              <span className="font-semibold">Tip:</span> Press{" "}
              <kbd className="bg-muted px-1 rounded border">Ctrl</kbd> +{" "}
              <kbd className="bg-muted px-1 rounded border">Enter</kbd> to send
            </p>
            <Button
              size="sm"
              disabled={!newComment.trim() || isPending}
              onClick={handleAddComment}
              className="ml-auto w-full sm:w-auto"
            >
              {isPending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="size-4 mr-2" /> Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
