import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.background,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
      width: 40,
    },
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      alignItems: "center",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${theme.colors.warning}18`,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}35`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.text("sm", "regular", theme.colors.muted),
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    description: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
    },
    benefitsCard: {
      width: "100%",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    benefitText: {
      ...theme.text("sm", "medium", theme.colors.text),
      flex: 1,
    },
    buttonContainer: {
      width: "100%",
      gap: theme.spacing.sm,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      ...theme.text("md", "bold"),
      color: theme.colors.background,
    },
  });
