export interface IReflection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  source?: string;
  imageUrl?: string;
  readingTimeMinutes: number;
  topic: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: Date;
}

export type ReflectionTopic = string;

export type ReflectionFilterType = "ALL" | "FAVORITES" | "BY_TOPIC" | "BY_AUTHOR";
