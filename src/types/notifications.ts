import { ForumReactionType } from "@/types/forum";

export type NotificationType = "forum_reaction_received" | "forum_new_comment_thread";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  toUserId: string;
  fromUserId: string | null;
  courseId: string | null;
  lessonId: string | null;
  commentId: string | null;
  reactionType: ForumReactionType | null;
  createdAt: Date | null;
  readAt: Date | null;
}
