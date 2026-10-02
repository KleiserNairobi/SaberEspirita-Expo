import React from "react";
import { View, Text } from "react-native";
import {
  BookOpen,
  Scale,
  Layers,
  Sparkles,
  ShieldAlert,
  Compass,
  Feather,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ISpecialElement, SpecialElementType } from "@/types/course";
import { createStyles } from "./styles";

interface SpecialElementCardProps {
  specialElement?: ISpecialElement | null;
  fontSize?: number;
}

interface ElementConfig {
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  getColor: (theme: any) => string;
}

const ELEMENT_CONFIGS: Record<SpecialElementType, ElementConfig> = {
  source_in_focus: {
    title: "A Fonte em Foco",
    icon: BookOpen,
    getColor: (theme) => theme.colors.primary,
  },
  dialogue_with_codification: {
    title: "Diálogo com a Codificação",
    icon: Scale,
    getColor: (theme) => theme.colors.primary,
  },
  comparative_study: {
    title: "Estudo Comparado",
    icon: Layers,
    getColor: (theme) => theme.colors.primary,
  },
  essential_distinction: {
    title: "Distinção Essencial",
    icon: Sparkles,
    getColor: (theme) => theme.colors.primary,
  },
  what_the_work_does_not_say: {
    title: "O que a Obra NÃO Diz",
    icon: ShieldAlert,
    getColor: (theme) => theme.colors.warning,
  },
  practical_application: {
    title: "Aplicação Prática",
    icon: Compass,
    getColor: (theme) => theme.colors.primary,
  },
  guided_reflection: {
    title: "Reflexão Guiada",
    icon: Feather,
    getColor: (theme) => theme.colors.primary,
  },
};

export const SpecialElementCard = React.memo(function SpecialElementCard({
  specialElement,
  fontSize = 16,
}: SpecialElementCardProps) {
  const { theme } = useAppTheme();

  if (!specialElement || !specialElement.content) {
    return null;
  }

  const type = specialElement.type as SpecialElementType;
  const config = ELEMENT_CONFIGS[type] || ELEMENT_CONFIGS.source_in_focus;
  const accentColor = config.getColor(theme);
  const styles = createStyles(theme, accentColor, fontSize);
  const IconComponent = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconComponent size={14} color={accentColor} />
        <Text style={styles.headerTitle}>{config.title}</Text>
      </View>
      <Text style={styles.content}>{specialElement.content}</Text>
    </View>
  );
});
