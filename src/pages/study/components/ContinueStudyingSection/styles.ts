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
      gap: 4,
    },
    sectionTitle: {
      ...theme.text("md", "bold"),
      color: theme.colors.text,
    },
    counterText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
    },
    listContent: {
      paddingHorizontal: theme.spacing.md,
      gap: 12,
    },
    card: {
      width: 280,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}18`,
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
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
      marginBottom: 2,
    },
    kicker: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.primary,
      fontSize: 10,
      letterSpacing: 0.5,
    },
    percentText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.textSecondary,
      fontSize: 10,
    },
    courseTitle: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    lessonTitle: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      fontSize: 11,
      marginBottom: 6,
    },
    progressBarBackground: {
      height: 3,
      backgroundColor: `${theme.colors.primary}18`,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
  });
