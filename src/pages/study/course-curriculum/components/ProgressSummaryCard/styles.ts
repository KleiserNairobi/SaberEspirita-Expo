import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      flex: 1,
    },
    progressSection: {
      marginBottom: theme.spacing.md,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    progressLabel: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    progressPercent: {
      ...theme.text("sm", "semibold", theme.colors.text),
    },
    progressBarBg: {
      width: "100%",
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: theme.radius.xs,
      overflow: "hidden",
      marginBottom: 4,
    },
    progressBarFill: {
      height: "100%",
      borderRadius: theme.radius.xs,
    },
    progressBarLessons: {
      backgroundColor: theme.colors.icon,
    },
    progressBarExercises: {
      backgroundColor: theme.colors.icon,
    },
    progressFooter: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    messageContainer: {
      marginTop: theme.spacing.xs,
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.warning}15`,
      borderRadius: theme.radius.sm,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.warning,
    },
    messageContainerSuccess: {
      backgroundColor: `${theme.colors.success}15`,
      borderLeftColor: theme.colors.success,
    },
    messageText: {
      ...theme.text("sm", "medium", theme.colors.warning),
      textAlign: "center",
    },
    messageTextSuccess: {
      color: theme.colors.success,
    },
  });
