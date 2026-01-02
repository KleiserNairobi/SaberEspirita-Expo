import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ITheme } from "@/configs/theme/types";

interface DifficultyBadgeProps {
  level: "Fácil" | "Médio" | "Difícil";
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const getStarsCount = () => {
    switch (level) {
      case "Fácil":
        return 1;
      case "Médio":
        return 2;
      case "Difícil":
        return 3;
    }
  };

  const starsCount = getStarsCount();

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Star
            key={index}
            size={12}
            color={theme.colors.muted}
            fill={index < starsCount ? theme.colors.muted : "transparent"}
          />
        ))}
      </View>
      <Text style={styles.label}>{level}</Text>
    </View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      gap: 6,
      backgroundColor: `${theme.colors.primary}20`,
    },
    starsContainer: {
      flexDirection: "row",
      gap: 2,
    },
    label: {
      ...theme.text("sm", "regular"),
      // color: theme.colors.muted, // Mesma cor das estrelas
      color: theme.colors.primary,
    },
  });
