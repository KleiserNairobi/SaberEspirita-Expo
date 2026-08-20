import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ForumCommentsResponse,
  forumApiService,
} from "@/services/api/forumApiService";
import { useAuthStore } from "@/stores/authStore";
import { CommunityLevelId, ForumComment, ForumReactionType } from "@/types/forum";

export const FORUM_KEYS = {
  communityProgress: (userId: string) => ["communityProgress", userId] as const,
  comments: (lessonId: string, userId: string) =>
    ["forumComments", lessonId, userId] as const,
  hasNew: (lessonId: string, userId: string) =>
    ["forumHasNew", lessonId, userId] as const,
};

/**
 * Hook para obter o progresso do usuário na comunidade via API REST.
 */
export function useCommunityProgress() {
  const { user, isGuest } = useAuthStore();

  return useQuery({
    queryKey: FORUM_KEYS.communityProgress(user?.uid || "guest"),
    queryFn: async () => {
      if (isGuest) return null;
      return forumApiService.getCommunityProgress();
    },
    enabled: !!user?.uid && !isGuest,
    staleTime: 1000 * 60 * 30, // 30 minutos
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

/**
 * Hook para verificar se existem novos comentários em uma lição.
 */
export function useForumHasNewComments(lessonId: string) {
  const { user, isGuest } = useAuthStore();

  return useQuery({
    queryKey: FORUM_KEYS.hasNew(lessonId, user?.uid || "guest"),
    queryFn: async () => {
      if (isGuest || !lessonId) return false;
      return forumApiService.hasNewComments(lessonId);
    },
    enabled: !!user?.uid && !isGuest && !!lessonId,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
  });
}

/**
 * Hook para buscar comentários paginados de uma lição (suporte a Infinite Scroll).
 */
export function useLessonForumComments(courseId: string, lessonId: string) {
  const { user, isGuest } = useAuthStore();

  return useInfiniteQuery({
    queryKey: FORUM_KEYS.comments(lessonId, user?.uid || "guest"),
    queryFn: async ({ pageParam = 1 }) => {
      if (isGuest || !lessonId) {
        return { comments: [], nextPage: null };
      }
      return forumApiService.getComments(lessonId, pageParam as number, 20);
    },
    enabled: !!lessonId && !isGuest,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
  });
}

/**
 * Hook de mutação para marcar o fórum da lição como visto.
 */
export function useSetForumLastSeen() {
  const { isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (isGuest) return;
      await forumApiService.setLastSeen(lessonId);
    },
  });
}

/**
 * Hook de mutação para criar um novo comentário na lição.
 */
export function useCreateForumComment() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (params: {
      courseId: string;
      lessonId: string;
      content: string;
      isAnonymous: boolean;
      userName?: string;
      userAvatar?: string | null;
      userCommunityLevel?: CommunityLevelId;
    }) => {
      if (isGuest) throw new Error("guest");
      return forumApiService.postComment(params.lessonId, {
        content: params.content,
        isAnonymous: params.isAnonymous,
      });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, user?.uid || "guest"),
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(user?.uid || "guest"),
      });
    },
  });
}

/**
 * Hook de mutação para remover (soft-delete) um comentário.
 */
export function useSoftDeleteForumComment() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (params: { lessonId: string; commentId: string }) => {
      if (isGuest) throw new Error("guest");
      await forumApiService.deleteComment(params.commentId);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, user?.uid || "guest"),
      });
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(user?.uid || "guest"),
      });
    },
  });
}

/**
 * Hook de mutação para alterar reação fraterna em um comentário com atualização otimista na UI.
 */
export function useSetForumReaction() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();
  const cacheUid = user?.uid || "guest";

  return useMutation({
    mutationFn: async (params: {
      lessonId: string;
      commentId: string;
      type: ForumReactionType;
    }) => {
      if (isGuest) throw new Error("guest");
      return forumApiService.toggleReaction(params.commentId, params.type);
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, cacheUid),
      });

      const previous = queryClient.getQueryData<
        InfiniteData<ForumCommentsResponse>
      >(FORUM_KEYS.comments(vars.lessonId, cacheUid));

      queryClient.setQueryData<InfiniteData<ForumCommentsResponse>>(
        FORUM_KEYS.comments(vars.lessonId, cacheUid),
        (old) => {
          if (!old?.pages) return old;

          const nextPages = old.pages.map((page) => {
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

      return { previous };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          FORUM_KEYS.comments(vars.lessonId, cacheUid),
          ctx.previous
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(cacheUid),
      });
    },
  });
}

/**
 * Hook de mutação para remover reação em um comentário com atualização otimista na UI.
 */
export function useRemoveForumReaction() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();
  const cacheUid = user?.uid || "guest";

  return useMutation({
    mutationFn: async (params: { lessonId: string; commentId: string }) => {
      if (isGuest) throw new Error("guest");
      return forumApiService.removeReaction(params.commentId);
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: FORUM_KEYS.comments(vars.lessonId, cacheUid),
      });

      const previous = queryClient.getQueryData<
        InfiniteData<ForumCommentsResponse>
      >(FORUM_KEYS.comments(vars.lessonId, cacheUid));

      queryClient.setQueryData<InfiniteData<ForumCommentsResponse>>(
        FORUM_KEYS.comments(vars.lessonId, cacheUid),
        (old) => {
          if (!old?.pages) return old;

          const nextPages = old.pages.map((page) => {
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

      return { previous };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          FORUM_KEYS.comments(vars.lessonId, cacheUid),
          ctx.previous
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FORUM_KEYS.communityProgress(cacheUid),
      });
    },
  });
}
