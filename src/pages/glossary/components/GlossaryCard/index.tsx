import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm, GLOSSARY_CATEGORIES } from "@/types/glossary";
import { useGlossaryFavoritesStore } from "@/stores/glossaryFavoritesStore";
import { createStyles } from "./styles";

interface GlossaryCardProps {
  term: IGlossaryTerm;
  onPress: () => void;
}

export function GlossaryCard({ term, onPress }: GlossaryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const isFavorite = useGlossaryFavoritesStore((s) => s.isFavorite(term.id));
  const CategoryIcon = GLOSSARY_CATEGORIES[term.category].icon;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {term.term}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {term.definition}
        </Text>

        {/* Categoria */}
        <View style={styles.categoryContainer}>
          <CategoryIcon size={14} color={theme.colors.primary} />
          <Text style={styles.category}>{term.category}</Text>
        </View>
      </View>

      {/* Ícone de navegação */}
      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}
