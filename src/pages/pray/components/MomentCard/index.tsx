import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface MomentCardProps {
  icon: string;
  label: string;
  categoryId: string;
  onPress: (categoryId: string) => void;
}

export function MomentCard({ icon, label, categoryId, onPress }: MomentCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(categoryId)}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
