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
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      flex: 1,
    },
    progressSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    progressIconContainer: {
      marginRight: 12,
    },
    progressContent: {
      flex: 1,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
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
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginTop: 4,
    },
    rateButtonContainer: {
      marginTop: theme.spacing.xs,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    methodologyButton: {
      flex: 1.2,
      backgroundColor: "#F2F4F1",
      borderRadius: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      gap: 8,
    },
    methodologyButtonText: {
      ...theme.text("sm", "regular", "#7A8C70"),
    },
    rateButton: {
      flex: 1,
      backgroundColor: "#6B7A5F",
      borderRadius: 100,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    rateButtonText: {
      ...theme.text("sm", "medium", "white"),
    },
  });
