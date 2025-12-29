import { LucideIcon } from "lucide-react-native";
import { BookOpen, Sparkles, Scale, Microscope, Cross, Brain } from "lucide-react-native";

export type GlossaryCategory =
  | "Doutrina Básica"
  | "Mediunidade"
  | "Moral e Ética"
  | "Ciência Espírita"
  | "Evangelho"
  | "Filosofia Espírita";

export const GLOSSARY_CATEGORIES: Record<
  GlossaryCategory,
  { label: string; icon: LucideIcon }
> = {
  "Doutrina Básica": { label: "Doutrina Básica", icon: BookOpen },
  Mediunidade: { label: "Mediunidade", icon: Sparkles },
  "Moral e Ética": { label: "Moral e Ética", icon: Scale },
  "Ciência Espírita": { label: "Ciência Espírita", icon: Microscope },
  Evangelho: { label: "Evangelho", icon: Cross },
  "Filosofia Espírita": { label: "Filosofia Espírita", icon: Brain },
};

export interface IGlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: GlossaryCategory;
  references: string[];
  relatedTerms: string[];
  synonyms?: string[];
  createdAt: Date;
  updatedAt: Date;
}
