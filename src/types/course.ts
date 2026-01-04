export interface ICourse {
  id: string;
  title: string;
  description: string;
  workloadMinutes: number;
  difficultyLevel: CourseDifficultyLevel;
  author: string;
  lessonCount: number;
  imageUrl?: string | number; // string para URL ou number para require()
  categoryId?: string;
  releaseYear?: number;
  featured?: boolean; // Curso em destaque (aparece em "Populares")
}

export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  slides: ISlide[];
  durationMinutes: number;
  quizId?: string;
  source?: string;
  chapter?: string;
}

export interface ISlide {
  slideType: SlideType;
  title: string;
  content: string;
  imagePrompt?: string;
  highlights?: string[];
  references?: {
    kardeciana?: string;
    biblica?: string;
  };
}

export interface IUserCourseProgress {
  userId: string;
  courseId: string;
  lastLessonId?: string;
  completedLessons: string[];
  completionPercentage: number;
  startedAt: Date;
  completedAt?: Date;
}

export type CourseDifficultyLevel = "Iniciante" | "Intermediário" | "Avançado";

export type SlideType = "text" | "image" | "highlight" | "reference";

export interface ICourseCategory {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
}
