import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hooks
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/hooks/use-notification";

interface NotificationType {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    name: string;
    profilePicture: string;
  };
  relatedId?: string;
  relatedModel?: "Task" | "Project" | "Comment";
}

export const NotificationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch Data
  const { data, isLoading } = useGetNotificationsQuery();
  const notifications = (data?.notifications as NotificationType[]) || [];
  const unreadCount = data?.unreadCount || 0;

  // Mutations
  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsReadMutation();

  // --- Handlers ---

  const handleNotificationClick = (notification: NotificationType) => {
    // 1. Mark as read immediately
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // 2. Navigate based on type
    setIsOpen(false); // Close popover
    if (notification.relatedId && notification.relatedModel === "Task") {
      // فرض بر اینکه آدرس تسک شما این شکلیه، اگه فرق داره عوضش کن
      // اگر پروژه رو هم داری، میتونی توی URL استفاده کنی
      navigate(`/dashboard/tasks/${notification.relatedId}`);
    } else if (notification.relatedModel === "Project") {
      navigate(`/dashboard/projects/${notification.relatedId}`);
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "TASK_ASSIGNED":
        return "📝";
      case "TASK_STATUS_CHANGED":
        return "🔄";
      case "COMMENT_MENTION":
        return "💬";
      case "PROJECT_INVITE":
        return "👋";
      case "TASK_UPDATED":
        return "⚠️"; // برای تغییر اولویت و...
      default:
        return "🔔";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5 text-muted-foreground" />

          {/* Red Badge for Unread Count */}
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            // یا اگر میخوای عدد نشون بدی:
            // <Badge variant="destructive" className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px] rounded-full">
            //   {unreadCount > 9 ? "+9" : unreadCount}
            // </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 mr-4" align="end">
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 text-xs text-blue-500 hover:text-blue-600"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* --- List --- */}
        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="size-8 mb-2 opacity-20" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  className={`flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent/50 border-b last:border-0 ${
                    !notification.isRead
                      ? "bg-blue-50/50 dark:bg-blue-900/10"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="relative">
                    <Avatar className="size-9 border">
                      <AvatarImage src={notification.sender.profilePicture} />
                      <AvatarFallback>
                        {notification.sender.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Tiny Icon Badge */}
                    <span className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full p-0.5 border shadow-sm">
                      {getIconByType(notification.type)}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm leading-tight ${!notification.isRead ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {/* Unread Indicator Dot */}
                  {!notification.isRead && (
                    <div className="size-2 mt-1.5 bg-blue-500 rounded-full shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
