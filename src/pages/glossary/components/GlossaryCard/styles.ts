import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginBottom: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      flex: 1,
      marginRight: 8,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.success + "20",
    },
    statusText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.success,
      textTransform: "capitalize",
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: 6,
      lineHeight: 18,
    },
    categoryContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    category: {
      ...theme.text("xs", "regular"),
      color: theme.colors.muted,
      marginLeft: 6,
      flex: 1,
    },
  });
}
