import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm, GLOSSARY_CATEGORIES } from "@/types/glossary";
import { createStyles } from "./styles";

interface GlossaryCardProps {
  term: IGlossaryTerm;
  onPress: (term: IGlossaryTerm) => void;
}

function GlossaryCardComponent({ term, onPress }: GlossaryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const CategoryIcon = GLOSSARY_CATEGORIES[term.category]?.icon;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(term)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {term.term}
          </Text>
        </View>

        <Text style={styles.subtitle} numberOfLines={2}>
          {term.definition}
        </Text>

        <View style={styles.categoryContainer}>
          {CategoryIcon && <CategoryIcon size={14} color={theme.colors.primary} />}
          <Text style={styles.category}>{term.category}</Text>
        </View>
      </View>

      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}

export const GlossaryCard = memo(GlossaryCardComponent);
