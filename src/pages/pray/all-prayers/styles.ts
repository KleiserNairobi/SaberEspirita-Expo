import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    categoriesScroll: {
      paddingBottom: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    categoriesContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    categoryCard: {
      width: 115,
      height: 115,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.md,
      gap: 4,
    },
    categoryIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    categoryLabel: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      textAlign: "center",
      lineHeight: 16,
      height: 32, // Para acomodar até 2 linhas uniformemente
    },
    categoryCount: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    stickyHeader: {
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      width: "100%",
    },
    searchContainer: {
      width: "100%",
    },
    listContent: {
      paddingBottom: 150,
      gap: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyText: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    itemWrapper: {
      paddingHorizontal: theme.spacing.lg,
    },
  });
}
