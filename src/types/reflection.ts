export interface IReflection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  source?: string;
  imageUrl?: string;
  readingTimeMinutes: number;
  topic: ReflectionTopic;
  tags?: string[];
  featured?: boolean;
  createdAt?: Date;
}

export type ReflectionTopic =
  | "ESPIRITUALIDADE"
  | "AUTOCONHECIMENTO"
  | "AMOR"
  | "CARIDADE"
  | "FE"
  | "PERDAO"
  | "GRATIDAO"
  | "REENCARNACAO"
  | "MEDIUNIDADE"
  | "EVANGELHO";

export type ReflectionFilterType = "ALL" | "FAVORITES" | "BY_TOPIC" | "BY_AUTHOR";

export const REFLECTION_TOPICS: Record<ReflectionTopic, { label: string; icon: string }> =
  {
    ESPIRITUALIDADE: { label: "Espiritualidade", icon: "sparkles" },
    AUTOCONHECIMENTO: { label: "Autoconhecimento", icon: "user-search" },
    AMOR: { label: "Amor", icon: "heart" },
    CARIDADE: { label: "Caridade", icon: "hand-heart" },
    FE: { label: "Fé", icon: "cross" },
    PERDAO: { label: "Perdão", icon: "handshake" },
    GRATIDAO: { label: "Gratidão", icon: "gift" },
    REENCARNACAO: { label: "Reencarnação", icon: "refresh-cw" },
    MEDIUNIDADE: { label: "Mediunidade", icon: "radio" },
    EVANGELHO: { label: "Evangelho", icon: "book-open" },
  };
