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
  const buttonColor = isTruth ? "#10B981" : "#EF4444"; // green : red
  const buttonBgColor = isTruth ? "#10B98115" : "#EF444415";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled ? theme.colors.card : buttonBgColor,
          borderColor: disabled ? theme.colors.border : buttonColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: buttonColor + "20" }]}>
        <Icon size={24} color={buttonColor} />
      </View>
      <Text
        style={[
          styles.label,
          {
            color: disabled ? theme.colors.textSecondary : buttonColor,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
