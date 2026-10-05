import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm + 4, // 12px
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
    },
    thumbnail: {
      width: 70,
      height: 70,
      borderRadius: theme.radius.sm,
      backgroundColor: `${theme.colors.primary}10`,
    },
    infoContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm + 4, // 12px
      justifyContent: "center",
    },
    header: {
      marginBottom: 6,
    },
    label: {
      ...theme.text("xs", "bold"),
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    contentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    courseTitle: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    lessonTitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    actionColumn: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 28,
      marginLeft: theme.spacing.xs,
    },
    percentText: {
      ...theme.text("xs", "bold"),
      color: theme.colors.primary,
      marginTop: 2,
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginTop: 8,
      width: "100%",
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
  });
