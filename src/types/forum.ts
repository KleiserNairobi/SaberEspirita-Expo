export type ForumReactionType =
  | "me_tocou"
  | "aprendi_algo"
  | "quero_refletir"
  | "gratidao"
  | "luz";

export type CommunityLevelId = "sementeiro" | "cultivador" | "arvore_frondosa";

export interface ForumComment {
  id: string;
  lessonId: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  isAnonymous: boolean;
  userCommunityLevel: CommunityLevelId;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  reactions: Record<ForumReactionType, number>;
  myReaction: ForumReactionType | null;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface CommunityProgress {
  userId: string;
  communityLevelId: CommunityLevelId;
  stats: {
    lessonsCompleted: number;
    coursesCompleted: number;
    forumComments: number;
    reactionsReceived: Record<ForumReactionType | "total", number>;
    activeDays: number;
    lastActiveAt: Date | null;
    hasCourseOver50: boolean;
  };
}

