import { ForumReactionType } from "@/types/forum";

export type NotificationType =
  | "forum_reaction_received"
  | "forum_new_comment_thread"
  | "admin_broadcast";

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
  fromUserName?: string | null;
  lessonTitle?: string | null;
  /** Usado por admin_broadcast: título da notificação */
  title?: string | null;
  /** Usado por admin_broadcast: corpo da mensagem */
  body?: string | null;
}
