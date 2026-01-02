import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface AnswerButtonProps {
  type: "truth" | "false";
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function AnswerButton({
  type,
  icon: Icon,
  label,
  onPress,
  disabled = false,
}: AnswerButtonProps) {
  const { theme } = useAppTheme();

  const isTruth = type === "truth";
  // Usando cores do tema para manter consistência com o design system (tons pastéis/terrosos)
  const buttonColor = isTruth ? theme.colors.success : theme.colors.error;
  const contentColor = theme.colors.onPrimary; // Garante contraste (Branco no Light, Escuro no Dark)

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled ? theme.colors.muted : buttonColor,
          borderRadius: theme.radius.md,
          opacity: disabled ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon size={24} color={contentColor} />
      </View>
      <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  iconContainer: {
    // Mantendo container para alinhamento se necessário, ou removendo background
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
