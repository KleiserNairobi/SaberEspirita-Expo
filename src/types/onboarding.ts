/**
 * Tipos e interfaces do fluxo de Onboarding Integrado do Saber Espírita.
 */

export type SpiritismMoment = "curious" | "studying" | "consolation";

export type OnboardingGoal =
  // Perfil Consolo
  | "daily_wisdom"
  | "prayers_relief"
  | "grief_comfort"
  | "family_peace"
  // Perfil Curiosidade
  | "basics_step_by_step"
  | "daily_wisdom_curious"
  | "how_to_pray"
  | "kardec_history"
  // Perfil Estudo
  | "kardec_deep"
  | "daily_wisdom_study"
  | "gospel_at_home"
  | "fix_quizzes"
  // Retrocompatibilidade
  | "prayers_reflections";

export type DailyTime = "3_min" | "10_min" | "own_pace";

export type NotificationTime = "08:00" | "20:00";

export interface OnboardingAnswers {
  moment?: SpiritismMoment;
  goal?: OnboardingGoal;
  dailyTime?: DailyTime;
  notificationTime?: NotificationTime;
}

export interface OnboardingOption<T extends string> {
  id: T;
  title: string;
  subtitle?: string;
  iconName: string;
}

export interface OnboardingState {
  hasCompletedOnboarding: boolean;
  answers: OnboardingAnswers;
  isSyncedWithBackend: boolean;
  completedAt?: string;
  setOnboardingAnswer: <K extends keyof OnboardingAnswers>(
    field: K,
    value: OnboardingAnswers[K]
  ) => void;
  completeOnboarding: () => Promise<void>;
  syncPendingOnboardingWithBackend: () => Promise<void>;
  resetOnboarding: () => void;
}
