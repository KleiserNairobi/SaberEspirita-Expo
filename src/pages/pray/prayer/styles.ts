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
      paddingBottom: 200,
    },
    header: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xxxl", "semibold"),
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    metadata: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    metadataText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    divider: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.textSecondary,
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
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      ...theme.text("lg", "regular"),
      lineHeight: 28,
      textAlign: "left",
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
    finishButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    finishButtonText: {
      ...theme.text("md", "semibold", theme.colors.background),
      textTransform: "uppercase",
    },
    fixedFooter: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
  });
