import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface CategoryCardProps {
  name: string;
  questionCount: number;
  progress: number; // 0-100
  icon: keyof typeof LucideIcons;
  gradientColors: [string, string]; // Não usado mais
  onPress: () => void;
}

export function CategoryCard({
  name,
  questionCount,
  progress,
  icon,
  onPress,
}: CategoryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const IconComponent = LucideIcons[icon] as React.ComponentType<any>;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Ícone */}
      <View style={styles.iconContainer}>
        <IconComponent size={20} color={theme.colors.primary} />
      </View>

      {/* Nome */}
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>

      {/* Quantidade */}
      <Text style={styles.questionCount}>{questionCount} questões</Text>

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </TouchableOpacity>
  );
}
