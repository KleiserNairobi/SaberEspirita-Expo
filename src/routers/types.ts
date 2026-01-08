// Tipos para navegação type-safe
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  FAQ: undefined;
  Privacy: undefined;
  Terms: undefined;
  EmotionalChat: undefined;
  ScientificChat: {
    initialMessage?: string;
  };
  Glossary: undefined;
  CoursesCatalog: undefined;
  CourseDetails: { courseId: string };
  CourseCurriculum: { courseId: string };
  LessonPlayer: { courseId: string; lessonId: string };
};

export type GlossaryStackParamList = {
  AllTerms: undefined;
  TermDetail: { id: string };
};

export type TabParamList = {
  StudyTab: undefined;
  FixTab: undefined;
  MeditateTab: undefined;
  PrayTab: undefined;
  AccountTab: undefined;
};

export type PrayStackParamList = {
  PrayHome: undefined;
  PrayCategory: { id: string };
  Prayer: { id: string };
};

export type MeditateStackParamList = {
  MeditateHome: undefined;
  AllReflections: undefined;
  Reflection: { id: string };
};

export type FixStackParamList = {
  FixHome: undefined;
  Subcategories: {
    categoryId: string;
    categoryName: string;
  };
  Quiz: {
    subcategoryId: string;
    categoryId: string;
    categoryName: string;
    subcategoryName: string;
    subtitle?: string; // Descrição específica do quiz
  };
  QuizResult: {
    categoryId: string;
    categoryName: string;
    subcategoryName: string;
    subtitle?: string;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
    level: string;
    userAnswers: any[]; // TODO: Tipar corretamente
  };
  QuizReview: {
    categoryId: string;
    categoryName: string;
    subcategoryName: string;
    subtitle?: string;
    totalQuestions: number;
    percentage: number;
    level: string;
    userAnswers: any[];
  };
  TruthOrFalseHome: undefined;
  TruthOrFalseQuestion: undefined;
  TruthOrFalseResult: {
    userAnswer: boolean;
    isCorrect: boolean;
    questionId: string;
    origin?: "home" | "history";
  };
  TruthOrFalseHistory: undefined;
};

// Tipos auxiliares para navegação
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
