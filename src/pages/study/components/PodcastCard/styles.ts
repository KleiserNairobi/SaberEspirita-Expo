import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      paddingVertical: theme.spacing.md - 2,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    premiumBorder: {
      borderColor: theme.colors.accent,
      borderWidth: 1.5,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    title: {
      ...theme.text("md", "medium"),
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      backgroundColor: `${theme.colors.success}20`,
    },
    statusText: {
      ...theme.text("xs", "semibold", theme.colors.success),
      textTransform: "capitalize",
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metaText: {
      ...theme.text("xs", "regular", theme.colors.primary),
    },
    metaTextAuthor: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      maxWidth: 100,
    },
    metaTextDate: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    metaDivider: {
      width: 4,
      height: 4,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.sm,
    },
  });
