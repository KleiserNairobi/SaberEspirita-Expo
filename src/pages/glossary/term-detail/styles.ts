import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 150,
    },
    header: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.readingText("xxl", "semibold"),
      color: theme.colors.text,
      textAlign: "left",
    },
    categoryContainer: {
      flexDirection: "row",
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    categoryTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.radius.full,
    },
    categoryTagText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.text("lg", "semibold"),
      marginBottom: theme.spacing.sm,
    },
    content: {
      ...theme.readingText("lg", "regular"),
      textAlign: "left",
    },
    reference: {
      ...theme.literaryText(15, theme.colors.textSecondary),
      lineHeight: 22,
      marginBottom: theme.spacing.xs,
    },
    askButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    askButtonText: {
      ...theme.text("md", "semibold"),
      color: "#fff",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    errorText: {
      ...theme.text("md", "regular", theme.colors.error),
      textAlign: "center",
    },
  });
