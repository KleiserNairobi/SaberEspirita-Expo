import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  BookOpen,
  CheckCircle,
  Clock,
  Compass,
  GraduationCap,
  Heart,
  Home,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react-native";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";

interface OnboardingOptionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const OnboardingOptionCard: React.FC<OnboardingOptionCardProps> = ({
  id,
  title,
  subtitle,
  iconName,
  isSelected,
  onSelect,
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme, isSelected);

  const renderIcon = () => {
    const iconColor = isSelected ? theme.colors.background : theme.colors.primary;
    const size = 20;

    switch (iconName) {
      case "compass":
        return <Compass size={size} color={iconColor} />;
      case "book-open":
        return <BookOpen size={size} color={iconColor} />;
      case "heart":
        return <Heart size={size} color={iconColor} />;
      case "sparkles":
        return <Sparkles size={size} color={iconColor} />;
      case "home":
        return <Home size={size} color={iconColor} />;
      case "graduation-cap":
        return <GraduationCap size={size} color={iconColor} />;
      case "clock":
        return <Clock size={size} color={iconColor} />;
      case "sun":
        return <Sun size={size} color={iconColor} />;
      case "moon":
        return <Moon size={size} color={iconColor} />;
      case "check-circle":
        return <CheckCircle size={size} color={iconColor} />;
      default:
        return <Compass size={size} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme, isSelected: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: isSelected
        ? `${theme.colors.primary}18`
        : `${theme.colors.primary}08`,
      borderWidth: 1,
      borderColor: isSelected ? theme.colors.primary : `${theme.colors.primary}25`,
      borderRadius: theme.radius.sm,
      gap: theme.spacing.md,
      elevation: 0,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: isSelected
        ? theme.colors.primary
        : `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("sm", "semibold", isSelected ? theme.colors.primary : theme.colors.text),
      marginBottom: 2,
    },
    subtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      lineHeight: 16,
    },
  });
