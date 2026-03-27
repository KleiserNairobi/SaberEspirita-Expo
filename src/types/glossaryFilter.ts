import { GlossaryCategory } from "./glossary";

export type GlossaryFilterType = "ALL" | "FAVORITES" | GlossaryCategory;

// Removemos GLOSSARY_FILTER_OPTIONS pois vamos gerenciar o carrossel no componente AllTermsScreen
