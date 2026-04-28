import React from "react";

import { StyleSheet, Text, View } from "react-native";

import type { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { ICategoryProgress } from "@/types/quiz";

import { CategoryProgressCard } from "../CategoryProgressCard";

/**
 * Propriedades do componente de lista de progresso por categoria
 */
interface CategoryProgressListProps {
  categories: ICategoryProgress[];
}

/**
 * Componente que exibe a lista de progresso do usuário agrupada por categoria
 */
export function CategoryProgressList({ categories }: CategoryProgressListProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Por categoria</Text>

      <View style={styles.list}>
        {categories.map((cat) => (
          <CategoryProgressCard key={cat.categoryId} category={cat} />
        ))}
      </View>
    </View>
  );
}

/**
 * Estilos para a lista de categorias
 */
function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    title: {
      ...theme.text("xxl", "regular"),
      color: theme.colors.text,
    },
    list: {
      gap: theme.spacing.md,
    },
  });
}
