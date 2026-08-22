import React from "react";
import { TouchableOpacity, Text, View, Image, ImageSourcePropType } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface CategoryCardProps {
  name: string;
  questionCount: number;
  progress: number; // 0-100
  icon?: string;
  onPress: () => void;
  imageSource?: ImageSourcePropType;
}

const CATEGORY_ICON_MAP: Record<string, keyof typeof LucideIcons> = {
  CONCEITOS: "Lightbulb",
  DIVERSOS: "Compass",
  ESPIRITOS: "Sun",
  FILMES: "Film",
  LIVROS: "BookOpen",
  PERSONAGENS: "Users",
};

export function getCategoryIconName(iconName?: string, categoryName?: string): keyof typeof LucideIcons {
  if (categoryName) {
    const normalized = categoryName
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (CATEGORY_ICON_MAP[normalized]) {
      return CATEGORY_ICON_MAP[normalized];
    }
  }

  if (iconName) {
    if (iconName in LucideIcons) {
      return iconName as keyof typeof LucideIcons;
    }
    const pascal = iconName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");
    if (pascal in LucideIcons) {
      return pascal as keyof typeof LucideIcons;
    }
  }

  return "BookOpen";
}

export function CategoryCard({
  name,
  questionCount,
  progress,
  icon,
  onPress,
  imageSource,
}: CategoryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const iconKey = getCategoryIconName(icon, name);
  const IconComponent = (LucideIcons[iconKey] || LucideIcons.BookOpen) as React.ComponentType<any>;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Ícone */}
      <View style={styles.iconContainer}>
        <IconComponent size={20} color={theme.colors.primary} />
      </View>

      {imageSource && (
        <Image source={imageSource} style={styles.backgroundImage} resizeMode="contain" />
      )}

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
