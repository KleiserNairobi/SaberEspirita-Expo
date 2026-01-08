import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface SubcategoryCardProps {
  title: string;
  subtitle: string;
  questionCount: number;
  completed: boolean;
  onPress: () => void;
}

export function SubcategoryCard({
  title,
  subtitle,
  questionCount,
  completed,
  onPress,
}: SubcategoryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.questionCount}>{questionCount} questões</Text>
        </View>

        {completed && (
          <View style={styles.iconContainer}>
            <CheckCircle2 size={24} color={theme.colors.success} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
