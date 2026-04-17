import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { differenceInDays } from "date-fns";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm, GLOSSARY_CATEGORIES } from "@/types/glossary";
import { useGlossaryFavoritesStore } from "@/stores/glossaryFavoritesStore";
import { createStyles } from "./styles";

interface GlossaryCardProps {
  term: IGlossaryTerm;
  onPress: () => void;
}

function GlossaryCardComponent({ term, onPress }: GlossaryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  // @ts-ignore - isFavorite está presente na store mas pode ter erro de tipo se a store for complexa
  const isFavorite = useGlossaryFavoritesStore((s) => s.isFavorite(term.id));
  const CategoryIcon = GLOSSARY_CATEGORIES[term.category].icon;

  // Lógica para detectar se o termo é novo (menos de 15 dias)
  const isNew = term.createdAt && differenceInDays(new Date(), term.createdAt) <= 15;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {term.term}
          </Text>
          {isNew && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Novo</Text>
            </View>
          )}
        </View>

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

export const GlossaryCard = memo(GlossaryCardComponent);
