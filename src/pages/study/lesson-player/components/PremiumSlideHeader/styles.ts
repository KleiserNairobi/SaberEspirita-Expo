import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme, fontSize: number = 16) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xs,
    },
    workContextBadge: {
      backgroundColor: theme.isDark ? `${theme.colors.primary}20` : `${theme.colors.primary}12`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 3,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}30`,
    },
    workContextText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    slideTypeBadge: {
      backgroundColor: theme.isDark ? `${theme.colors.accent}20` : `${theme.colors.accent}12`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 3,
      borderRadius: theme.radius.sm,
    },
    slideTypeText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.accent,
      letterSpacing: 0.4,
    },
    learningGoalCard: {
      backgroundColor: theme.isDark ? `${theme.colors.card}90` : `${theme.colors.primary}08`,
      borderRadius: theme.radius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
    },
    learningGoalText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      fontSize: Math.max(13, fontSize * 0.85),
      lineHeight: fontSize * 1.25,
      marginLeft: theme.spacing.xs,
      flex: 1,
    },
    learningGoalLabel: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.primary,
    },
  });
