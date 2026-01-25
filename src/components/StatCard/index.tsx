import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "primary" | "secondary";
  onPress?: () => void;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  variant = "primary",
  onPress,
}: StatCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const isPrimary = variant === "primary";

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
    },
  ];

  const content = (
    <>
      <View
        style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}
      >
        <Icon size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}
