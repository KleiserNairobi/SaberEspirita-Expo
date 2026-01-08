import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const containerStyle = [
    styles.container,
    variant === "outline" && styles.containerOutline,
    fullWidth && styles.containerFullWidth,
    disabled && styles.containerDisabled,
  ];

  const textStyle = [
    styles.text,
    variant === "outline" && styles.textOutline,
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? theme.colors.primary : "white"}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
