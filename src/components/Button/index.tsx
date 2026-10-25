import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle: customTextStyle,
}: ButtonProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const containerStyle = [
    styles.container,
    size === "sm" && styles.containerSm,
    size === "lg" && styles.containerLg,
    variant === "outline" && styles.containerOutline,
    fullWidth && styles.containerFullWidth,
    disabled && (variant === "outline" ? styles.containerOutlineDisabled : styles.containerDisabled),
    style,
  ];

  const textStyle = [
    styles.text,
    size === "sm" && styles.textSm,
    size === "lg" && styles.textLg,
    variant === "outline" && styles.textOutline,
    disabled && (variant === "outline" ? styles.textOutlineDisabled : styles.textDisabled),
    customTextStyle,
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
        <>
          {icon && icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
