import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { auth } from "@/configs/firebase/firebase";
import {
  createForumComment,
  getCommunityProgress,
  getForumCommentsPage,
  hasNewForumComments,
  removeForumReaction,
  setForumLastSeen,
  setForumReaction,
  softDeleteForumComment,
} from "@/services/firebase/forumService";
import { useAuthStore } from "@/stores/authStore";
import { CommunityLevelId, ForumComment, ForumReactionType } from "@/types/forum";

export const FORUM_KEYS = {
  communityProgress: (userId: string) => ["communityProgress", userId] as const,
  comments: (lessonId: string, userId: string) =>
    ["forumComments", lessonId, userId] as const,
  hasNew: (lessonId: string, userId: string) =>
    ["forumHasNew", lessonId, userId] as const,
};

export function useCommunityProgress() {
  const { user, isGuest } = useAuthStore();
  const uid = auth.currentUser?.uid || user?.uid || null;

  return useQuery({
    queryKey: FORUM_KEYS.communityProgress(uid || "guest"),
    queryFn: async () => {
      if (isGuest) return null;
      if (!uid) return null;
      return getCommunityProgress(uid);
    },
    enabled: !!uid && !isGuest,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

export function useForumHasNewComments(lessonId: string) {
  const { user, isGuest } = useAuthStore();
  const uid = auth.currentUser?.uid || user?.uid || null;

  return useQuery({
    queryKey: FORUM_KEYS.hasNew(lessonId, uid || "guest"),
    queryFn: async () => {
      if (isGuest) return false;
      if (!uid || !lessonId) return false;
      return hasNewForumComments({ userId: uid, lessonId });
    },
    enabled: !!uid && !isGuest && !!lessonId,
    staleTime: 1000 * 60 * 1, // 1 minuto
    refetchOnMount: true,
  });
}

export function useLessonForumComments(courseId: string, lessonId: string) {
  const { user, isGuest } = useAuthStore();
  const uid = auth.currentUser?.uid || user?.uid || null;

  return useInfiniteQuery({
    queryKey: FORUM_KEYS.comments(lessonId, uid || "guest"),
    queryFn: async ({ pageParam }) => {
      if (isGuest) {
        return { comments: [], cursor: null };
      }
      if (!uid) return { comments: [], cursor: null };
      return getForumCommentsPage({
        lessonId,
        courseId,
        userId: uid,
        pageSize: 20,
        cursor: pageParam ?? undefined,
      });
    },
    enabled: !!lessonId && !!courseId && !!uid && !isGuest,
    retry: false,
    initialPageParam: null as unknown,
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    staleTime: 1000 * 60 * 2, // 2 minutos — mitiga N+1 reads enquanto desnormalização não é implementada
    refetchOnMount: true,
  });
}

export function useSetForumLastSeen() {
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (isGuest) return;
      if (!user?.uid) throw new Error("User not authenticated");
      await setForumLastSeen({ userId: user.uid, lessonId });
    },
  });
}

export function useCreateForumComment() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (params: {
      courseId: string;
      lessonId: string;
      content: string;
      isAnonymous: boolean;
      userName: string;
      userAvatar: string | null;
      userCommunityLevel: CommunityLevelId;
    }) => {
      if (isGuest) throw new Error("guest");
      if (!user?.uid) throw new Error("User not authenticated");
      return createForumComment({
        courseId: params.courseId,
        lessonId: params.lessonId,
        userId: user.uid,
        userName: params.userName,
        userAvatar: params.userAvatar,
        userCommunityLevel: params.userCommunityLevel,
        content: params.content,
        isAnonymous: params.isAnonymous,
      });
    },
    onSuccess: (_commentId, vars) => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, user?.uid || "guest"),
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(user?.uid || "guest"),
      });
    },
  });
}

export function useSoftDeleteForumComment() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (params: { lessonId: string; commentId: string }) => {
      if (isGuest) throw new Error("guest");
      await softDeleteForumComment(params);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, user?.uid || "guest"),
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(user?.uid || "guest"),
      });
    },
  });
}

export function useSetForumReaction() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();
  const uid = auth.currentUser?.uid || user?.uid || null;

  return useMutation({
    mutationFn: async (params: {
      lessonId: string;
      commentId: string;
      type: ForumReactionType;
    }) => {
      if (isGuest) throw new Error("guest");
      if (!auth.currentUser?.uid) throw new Error("User not authenticated");
      await setForumReaction({
        lessonId: params.lessonId,
        commentId: params.commentId,
        userId: auth.currentUser.uid,
        type: params.type,
      });
    },
    onMutate: async (vars) => {
      const cacheUid = uid || "guest";
      await queryClient.cancelQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, cacheUid),
      });

      const previous = queryClient.getQueryData<any>(
        FORUM_KEYS.comments(vars.lessonId, cacheUid)
      );

      queryClient.setQueryData<any>(
        FORUM_KEYS.comments(vars.lessonId, cacheUid),
        (old: any) => {
          if (!old?.pages) return old;

          const nextPages = old.pages.map((page: any) => {
            const nextComments = (page.comments ?? []).map((c: ForumComment) => {
              if (c.id !== vars.commentId) return c;

              const prevType = c.myReaction;
              const nextType = vars.type;

              if (prevType === nextType) return c;

              const reactions = { ...c.reactions };
              if (prevType) {
                reactions[prevType] = Math.max(0, (reactions[prevType] ?? 0) - 1);
              }
              reactions[nextType] = (reactions[nextType] ?? 0) + 1;

              return { ...c, reactions, myReaction: nextType };
            });

            return { ...page, comments: nextComments };
          });

          return { ...old, pages: nextPages };
        }
      );

      return { previous, uid: cacheUid };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          FORUM_KEYS.comments(vars.lessonId, ctx.uid),
          ctx.previous
        );
      }
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, uid || "guest"),
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(uid || "guest"),
      });
    },
  });
}

export function useRemoveForumReaction() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();
  const uid = auth.currentUser?.uid || user?.uid || null;

  return useMutation({
    mutationFn: async (params: { lessonId: string; commentId: string }) => {
      if (isGuest) throw new Error("guest");
      if (!auth.currentUser?.uid) throw new Error("User not authenticated");
      await removeForumReaction({
        lessonId: params.lessonId,
        commentId: params.commentId,
        userId: auth.currentUser.uid,
      });
    },
    onMutate: async (vars) => {
      const cacheUid = uid || "guest";
      await queryClient.cancelQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, cacheUid),
      });

      const previous = queryClient.getQueryData<any>(
        FORUM_KEYS.comments(vars.lessonId, cacheUid)
      );

      queryClient.setQueryData<any>(
        FORUM_KEYS.comments(vars.lessonId, cacheUid),
        (old: any) => {
          if (!old?.pages) return old;

          const nextPages = old.pages.map((page: any) => {
            const nextComments = (page.comments ?? []).map((c: ForumComment) => {
              if (c.id !== vars.commentId) return c;

              const prevType = c.myReaction;
              if (!prevType) return c;

              const reactions = { ...c.reactions };
              reactions[prevType] = Math.max(0, (reactions[prevType] ?? 0) - 1);

              return { ...c, reactions, myReaction: null };
            });

            return { ...page, comments: nextComments };
          });

          return { ...old, pages: nextPages };
        }
      );

      return { previous, uid: cacheUid };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          FORUM_KEYS.comments(vars.lessonId, ctx.uid),
          ctx.previous
        );
      }
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, uid || "guest"),
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(uid || "guest"),
      });
    },
  });
}
