import { GlossaryCategory } from "./glossary";

export type GlossaryFilterType = "ALL" | "FAVORITES" | "BY_CATEGORY";

export const GLOSSARY_FILTER_OPTIONS: Record<
  GlossaryFilterType,
  { label: string; value: GlossaryFilterType }
> = {
  ALL: { label: "Todos", value: "ALL" },
  FAVORITES: { label: "Apenas Favoritos", value: "FAVORITES" },
  BY_CATEGORY: { label: "Por Categoria", value: "BY_CATEGORY" },
};
