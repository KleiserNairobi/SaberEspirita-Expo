export interface ILeaderboardUser {
  userId: string;
  userName: string;
  photoURL?: string; // Alterado de avatarUrl para photoURL para consistência com Auth
  score: number;
  totalAllTime?: number;
  totalThisWeek?: number;
  totalThisMonth?: number;
  position: number;
  level?: string; // Alterado para string para suportar "Iniciante", "Sábio", etc.
  isCurrentUser?: boolean;
}

export enum TimeFilterEnum {
  WEEK = "week",
  MONTH = "month",
  ALL = "all",
}

export type TimeFilter = TimeFilterEnum | "week" | "month" | "all";
