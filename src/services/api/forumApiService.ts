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

export const forumApiService = {
  /**
   * Obtém a lista paginada de comentários de uma lição.
   */
  async getComments(
    lessonId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ForumCommentsResponse> {
    if (!lessonId) return { comments: [], nextPage: null };
    const response = await apiClient.get<any>(
      `/forum/lessons/${lessonId}/comments`,
      { params: { page, limit } }
    );
    const data = response.data;
    if (!data) return { comments: [], nextPage: null };
    if (Array.isArray(data)) return { comments: data, nextPage: null };
    return {
      comments: Array.isArray(data.comments) ? data.comments : [],
      nextPage: data.nextPage ?? null,
      totalComments: data.totalComments,
    };
  },

  /**
   * Posta um novo comentário em uma lição.
   */
  async postComment(
    lessonId: string,
    payload: CreateCommentPayload
  ): Promise<ForumComment> {
    const response = await apiClient.post<ForumComment>(
      `/forum/lessons/${lessonId}/comments`,
      payload
    );
    return response.data;
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
