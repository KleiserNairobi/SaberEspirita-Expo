export interface IPrayer {
  id: string;
  title: string;
  content: string;
  source?: string;
  author?: string;
  featured?: boolean;
}

export interface IPrayerCategory {
  id: string;
  title: string;
  description?: string;
  image?: string;
  prayerCount: number;
}

export interface IPrayerCategoryLink {
  id: string;
  prayerId: string;
  categoryId: string;
}

export type PrayerMoment =
  | "AO-ACORDAR"
  | "AO-DORMIR"
  | "DIARIO"
  | "POR-ANIMO"
  | "POR-ALGUEM"
  | "POR-CURA"
  | "POR-GRATIDAO"
  | "POR-PAZ";

// Tipo genérico de filtro para conteúdos (Orações e Reflexões)
export type ContentFilterType =
  | "ALL"
  | "FAVORITES"
  | "BY_AUTHOR"
  | "BY_SOURCE"
  | "BY_TOPIC" // Usado para reflexões
  | "MINUTES_SHORT" // Usado para meditações (<= 5min)
  | "MINUTES_LONG" // Usado para meditações (> 5min)
  | "INICIANTE" // Usado para cursos
  | "INTERMEDIARIO" // Usado para cursos
  | "AVANCADO" // Usado para cursos
  | "EM_ANDAMENTO" // Usado para cursos
  | "CONCLUIDOS"; // Usado para cursos

// Mantido para compatibilidade com código existente de orações
export type PrayerFilterType = "ALL" | "FAVORITES" | "BY_AUTHOR" | "BY_SOURCE";

export interface IAmbientAudio {
  id: string;
  title: string;
  type: "music" | "nature";
  url: string;
}

export const PRAYER_MOMENTS: Record<PrayerMoment, { label: string }> = {
  "AO-ACORDAR": { label: "Ao Acordar" },
  "AO-DORMIR": { label: "Ao Dormir" },
  DIARIO: { label: "Diário" },
  "POR-ANIMO": { label: "Por Ânimo" },
  "POR-ALGUEM": { label: "Por Alguém" },
  "POR-CURA": { label: "Por Cura" },
  "POR-GRATIDAO": { label: "Por Gratidão" },
  "POR-PAZ": { label: "Por Paz" },
};
