import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      alignItems: "center",
    },
    starsContainer: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },
    resultImage: {
      width: 250,
      height: 180,
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    subcategoryName: {
      ...theme.text("lg", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    categoryName: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    statsContainer: {
      flexDirection: "row",
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    statBox: {
      alignItems: "center",
    },
    statValue: {
      ...theme.text("xxl", "bold"),
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    unlockMessage: {
      ...theme.text("sm", "medium"),
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    feedbackContainer: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
    },
    feedbackTitle: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    feedbackMessage: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
    footer: {
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });
}
