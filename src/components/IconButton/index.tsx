import React from "react";
import { TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function IconButton({
  icon: Icon,
  onPress,
  size = 24,
  color,
  backgroundColor,
}: IconButtonProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, backgroundColor && { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={size} color={color || theme.colors.text} />
    </TouchableOpacity>
  );
}
