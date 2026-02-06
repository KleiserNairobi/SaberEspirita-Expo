export interface ICourse {
  id: string;
  title: string;
  description: string;
  order: number;
  learningObjectives?: string[];
  workloadMinutes: number;
  difficultyLevel: CourseDifficultyLevel;
  author: string;
  lessonCount: number;
  imageUrl?: string | number;
  categoryId?: string;
  releaseYear?: number;
  featured?: boolean;
  status: CourseStatus;
  certification: {
    enabled: boolean;
    minimumGrade: number;
    requiredLessonsPercent: number;
    requiredExercisesPercent: number;
  };
  stats?: {
    exerciseCount: number;
    totalDurationMinutes: number;
    enrolledStudents?: number;
    completionRate?: number;
  };
}

export interface ILesson {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description?: string;
  order: number;
  slides: ISlide[];
  durationMinutes: number;
  source?: string;
  chapter?: string;
  status: LessonStatus;
  videoUrl?: string;
  audioUrl?: string;
  supplementaryMaterials?: ISupplementaryMaterial[];
  reflectionQuestions?: IReflectionQuestion[];
}

export interface ISlide {
  slideType: SlideType;
  title: string;
  content: string;
  imagePrompt?: string;
  highlights?: { title: string; content: string }[];
  references?: {
    kardeciana?: string;
    biblica?: string;
  };
}

export interface IReflectionQuestion {
  question: string;
  focus: "Autoconhecimento" | "Aplicação prática" | "Transformação moral";
}

export interface IUserCourseProgress {
  userId: string;
  courseId: string;

  // Progresso de Aulas
  lastLessonId?: string;
  completedLessons: string[];
  // lessonsCompletionPercent: number; // REMOVED (Calculated on frontend)

  // ✅ NOVO - Exercícios Pendentes (REMOVIDO: Agora calculado dinamicamente)
  // pendingExercises: string[];

  // ✅ NOVO - Progresso de Exercícios
  exerciseResults: IExerciseResult[];
  // exercisesCompletionPercent: number; // REMOVED (Calculated on frontend)

  // ✅ NOVO - Nota Final
  finalGrade?: number;

  // ✅ NOVO - Certificação
  certificateEligible: boolean;
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
  certificateUrl?: string;

  // Timestamps
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

export type CourseDifficultyLevel = "Iniciante" | "Intermediário" | "Avançado";

export type CourseStatus = "PUBLISHED" | "COMING_SOON" | "DRAFT";

export type LessonStatus = "PUBLISHED" | "COMING_SOON" | "DRAFT";

export type SlideType = "text" | "image" | "highlight" | "reference";

export interface ICourseCategory {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
}

// ✅ NOVO - Exercícios
export interface IExercise {
  id: string;
  courseId: string;
  lessonId?: string;
  moduleId?: string;
  title: string;
  description?: string;
  order: number;
  type: ExerciseType;
  weight: number;
  passingGrade: number;
  maxAttempts?: number;
  timeLimit?: number;
  status: ExerciseStatus;
  quizId?: string;
  essayQuestions?: IEssayQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export type ExerciseType = "QUIZ" | "TRUE_FALSE" | "ESSAY" | "MIXED";

export type ExerciseStatus = "PUBLISHED" | "COMING_SOON" | "DRAFT";

export interface IEssayQuestion {
  id: string;
  question: string;
  expectedAnswer?: string;
  maxWords?: number;
  minWords?: number;
}

export interface IExerciseResult {
  exerciseId: string;
  attempts: IExerciseAttempt[];
  bestScore: number;
  passed: boolean;
  completedAt?: Date;
}

export interface IExerciseAttempt {
  attemptNumber: number;
  score: number;
  answers: unknown[];
  startedAt: Date;
  completedAt: Date;
  timeSpent: number;
}

// ✅ NOVO - Material Complementar
export interface ISupplementaryMaterial {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  url?: string;
  fileUrl?: string;
  content?: string;
  order: number;
}

export type MaterialType = "PDF" | "LINK" | "TEXT" | "VIDEO" | "AUDIO" | "REFERENCE";

// ✅ NOVO - Certificados
export interface ICertificate {
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  studentDocument?: string;
  courseTitle: string;
  courseAuthor: string;
  courseWorkloadMinutes: number;
  finalGrade: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl: string;
  validationCode: string;
  validationUrl: string;
}
