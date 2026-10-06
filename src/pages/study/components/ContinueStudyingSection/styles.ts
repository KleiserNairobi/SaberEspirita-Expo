import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    titleTouchable: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    sectionTitle: {
      ...theme.text("md", "bold"),
    },
    counterText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    listContent: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    card: {
      width: 280,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}18`,
      padding: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: theme.radius.xs,
      backgroundColor: `${theme.colors.primary}10`,
    },
    infoContainer: {
      flex: 1,
      justifyContent: "center",
    },
    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs / 2,
    },
    kicker: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      letterSpacing: 0.5,
    },
    percentText: {
      ...theme.text("xs", "semibold", theme.colors.textSecondary),
    },
    courseTitle: {
      ...theme.text("sm", "semibold"),
      marginBottom: theme.spacing.xs / 2,
    },
    lessonTitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginBottom: theme.spacing.xs,
    },
    progressBarBackground: {
      height: 3,
      backgroundColor: `${theme.colors.primary}18`,
      borderRadius: theme.radius.xs,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.xs,
    },
  });
