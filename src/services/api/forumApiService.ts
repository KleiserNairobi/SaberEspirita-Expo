import apiClient from "./apiClient";
import { CommunityProgress, ForumComment, ForumReactionType } from "@/types/forum";

export interface CreateCommentPayload {
  content: string;
  isAnonymous?: boolean;
}

export interface ForumCommentsResponse {
  comments: ForumComment[];
  nextPage?: number | null;
  totalComments?: number;
}

function normalizeReactions(raw: any): Record<ForumReactionType, number> {
  if (!raw || typeof raw !== "object") {
    return {
      me_tocou: 0,
      aprendi_algo: 0,
      quero_refletir: 0,
      gratidao: 0,
      luz: 0,
    };
  }
  return {
    me_tocou: Number(raw.me_tocou ?? raw.meTocou ?? 0),
    aprendi_algo: Number(raw.aprendi_algo ?? raw.aprendiAlgo ?? 0),
    quero_refletir: Number(raw.quero_refletir ?? raw.queroRefletir ?? 0),
    gratidao: Number(raw.gratidao ?? raw.gratidao ?? 0),
    luz: Number(raw.luz ?? raw.luz ?? 0),
  };
}

export const forumApiService = {
  /**
   * Obtém a lista paginada de comentários de uma lição.
   */
  async getComments(
    lessonId: string,
    page: number = 0,
    limit: number = 20
  ): Promise<ForumCommentsResponse> {
    if (!lessonId) return { comments: [], nextPage: null };
    const pageNum = typeof page === "number" && !isNaN(page) ? Math.max(0, page) : 0;
    const response = await apiClient.get<any>(
      `/forum/lessons/${lessonId}/comments`,
      { params: { page: pageNum, size: limit, limit } }
    );
    const data = response.data;
    console.log(`[forumApiService.getComments] lessonId="${lessonId}", page=${pageNum}, status=${response.status}`, "data:", data);
    if (!data) return { comments: [], nextPage: null };

    const rawComments = Array.isArray(data)
      ? data
      : Array.isArray(data.content)
      ? data.content
      : Array.isArray(data.comments)
      ? data.comments
      : [];

    const comments: ForumComment[] = rawComments.map((item: any) => ({
      ...item,
      myReaction: item.myReaction ?? item.userReaction ?? null,
      reactions: normalizeReactions(item.reactions),
    }));

    const isLast =
      data.last === true ||
      (data.number !== undefined &&
        data.totalPages !== undefined &&
        data.number >= data.totalPages - 1);
    const nextPage = isLast
      ? null
      : data.number !== undefined
      ? data.number + 1
      : page + 1;

    return {
      comments,
      nextPage,
      totalComments: data.totalElements ?? data.totalComments ?? comments.length,
    };
  },

  /**
   * Posta um novo comentário em uma lição.
   */
  async postComment(
    lessonId: string,
    payload: CreateCommentPayload
  ): Promise<ForumComment> {
    const response = await apiClient.post<any>(
      `/forum/lessons/${lessonId}/comments`,
      payload
    );
    const item = response.data;
    return {
      ...item,
      myReaction: item?.myReaction ?? item?.userReaction ?? null,
      reactions: normalizeReactions(item?.reactions),
    };
  },

  /**
   * Remove (soft-delete) um comentário feito pelo usuário autenticado.
   */
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/forum/comments/${commentId}`);
  },

  /**
   * Alterna uma reação fraterna (*Me Tocou*, *Aprendi Algo*, etc.) em um comentário.
   */
  async toggleReaction(
    commentId: string,
    reactionType: ForumReactionType
  ): Promise<Record<ForumReactionType, number>> {
    const response = await apiClient.post<Record<ForumReactionType, number>>(
      `/forum/comments/${commentId}/reactions`,
      { type: reactionType }
    );
    return response.data;
  },

  /**
   * Remove uma reação em um comentário.
   */
  async removeReaction(commentId: string): Promise<Record<ForumReactionType, number>> {
    const response = await apiClient.delete<Record<ForumReactionType, number>>(
      `/forum/comments/${commentId}/reactions`
    );
    return response.data;
  },

  /**
   * Obtém o progresso do usuário no nível da comunidade.
   */
  async getCommunityProgress(): Promise<CommunityProgress | null> {
    const response = await apiClient.get<CommunityProgress>("/forum/community-progress/me");
    return response.data || null;
  },

  /**
   * Verifica se há novos comentários em uma lição desde a última visualização.
   */
  async hasNewComments(lessonId: string): Promise<boolean> {
    if (!lessonId) return false;
    const response = await apiClient.get<{ hasNew: boolean }>(
      `/forum/lessons/${lessonId}/has-new`
    );
    return !!response.data?.hasNew;
  },

  /**
   * Marca a lição como vista no fórum.
   */
  async setLastSeen(lessonId: string): Promise<void> {
    if (!lessonId) return;
    await apiClient.post(`/forum/lessons/${lessonId}/last-seen`);
  },
};
