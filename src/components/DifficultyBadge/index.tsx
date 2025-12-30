import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface DifficultyBadgeProps {
  level: "Fácil" | "Médio" | "Difícil";
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const { colors } = useAppTheme();

  const getDifficultyConfig = () => {
    switch (level) {
      case "Fácil":
        return {
          stars: 1,
          color: "#10B981", // green
          bgColor: "#10B98115",
        };
      case "Médio":
        return {
          stars: 2,
          color: "#F59E0B", // amber
          bgColor: "#F59E0B15",
        };
      case "Difícil":
        return {
          stars: 3,
          color: "#EF4444", // red
          bgColor: "#EF444415",
        };
    }
  };

  const config = getDifficultyConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }]}>
      <View style={styles.starsContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Star
            key={index}
            size={12}
            color={config.color}
            fill={index < config.stars ? config.color : "transparent"}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: config.color }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
