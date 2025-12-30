import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

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

  const isPrimary = variant === "primary";

  const containerStyle = [
    styles.container,
    {
      backgroundColor: isPrimary ? theme.colors.primary + "15" : theme.colors.card,
      borderColor: isPrimary ? theme.colors.primary : theme.colors.border,
    },
  ];

  const iconColor = isPrimary ? theme.colors.primary : theme.colors.secondary;

  const content = (
    <>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
        <Icon size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
});
