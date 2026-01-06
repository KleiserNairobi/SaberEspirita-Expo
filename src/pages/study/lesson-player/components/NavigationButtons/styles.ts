import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    buttonPrevious: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      paddingVertical: 12,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: "transparent",
    },
    buttonPreviousText: {
      ...theme.text("md", "medium"),
    },
    buttonNext: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      paddingVertical: 12,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    buttonNextText: {
      ...theme.text("md", "bold"),
      color: "#FFFFFF",
    },
    buttonFinish: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.success,
      borderWidth: 1,
      borderColor: theme.colors.success,
    },
    buttonFinishText: {
      ...theme.text("md", "bold"),
      color: "#FFFFFF",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonDisabledText: {
      color: theme.colors.textSecondary,
    },
  });
