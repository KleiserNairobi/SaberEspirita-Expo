import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
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
    premiumBorder: {
      borderColor: theme.colors.accent,
      borderWidth: 1.5,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    title: {
      ...theme.text("md", "medium"),
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
      backgroundColor: `${theme.colors.success}20`,
    },
    statusText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.success,
      textTransform: "capitalize",
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.primary,
      fontFamily: "Oswald_400Regular",
    },
    metaTextAuthor: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      maxWidth: 120,
    },
    metaDivider: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      marginHorizontal: 8,
    },
  });
