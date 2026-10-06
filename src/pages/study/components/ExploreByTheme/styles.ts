import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: 0,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + 4, // 12px
    },
    sectionTitle: {
      ...theme.text("xxl", "regular"),
      color: theme.colors.text,
    },
    seeAllText: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + 4, // 12px
    },
    pillScrollView: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 4,
      gap: 8,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}12`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}20`,
    },
    pillActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    pillText: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
    pillTextActive: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.onPrimary,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      rowGap: 14,
      marginTop: 16,
    },
    gridItem: {
      width: "48.2%",
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
  });
