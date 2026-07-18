import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface SubcategoryCardProps {
  title: string;
  subtitle: string;
  questionCount: number;
  completed: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function SubcategoryCard({
  title,
  subtitle,
  questionCount,
  completed,
  loading = false,
  disabled = false,
  onPress,
}: SubcategoryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.questionCount}>{questionCount} questões</Text>
        </View>

        {(completed || loading) && (
          <View style={styles.iconContainer}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <CheckCircle2 size={24} color={theme.colors.success} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
