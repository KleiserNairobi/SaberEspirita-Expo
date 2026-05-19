import * as LucideIcons from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

import type { ICategoryProgress } from "@/types/quiz";

/**
 * Propriedades do componente de card de progresso por categoria
 */
interface CategoryProgressCardProps {
  category: ICategoryProgress;
}

/**
 * Componente que exibe o progresso do usuário em uma categoria específica
 * Utiliza o ícone mapeado e uma barra de progresso horizontal
 */
export function CategoryProgressCard({ category }: CategoryProgressCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Seleciona o ícone dinâmico baseado no mapeamento vindo do serviço
  // @ts-ignore
  const IconComponent = LucideIcons[category.icon] || LucideIcons.HelpCircle;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <View style={styles.iconContainer}>
            <IconComponent size={20} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.name}>{category.categoryName}</Text>
            <Text style={styles.details}>
              {category.totalQuestionsAnswered.toLocaleString("pt-BR")} questões
              respondidas
            </Text>
          </View>
        </View>
        <Text style={styles.percentage}>{category.completionPercentage}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { width: `${category.completionPercentage}%` }]}
        />
      </View>
    </View>
  );
}
