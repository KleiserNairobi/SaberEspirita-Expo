import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
      ...theme.shadows.sm,
    },
    content: {
      gap: 8,
    },
    activeContent: {
      gap: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    suggestionLabel: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      letterSpacing: 1,
    },
    greeting: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
    },
    description: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      lineHeight: 20,
    },
    suggestionCard: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    prayerInfo: {
      flex: 1,
      gap: 4,
    },
    prayerTitle: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
    },
    prayerCategory: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    actionButtonText: {
      ...theme.text("xs", "bold", theme.colors.onPrimary),
    },
    aiLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    aiLinkText: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      textDecorationLine: "underline",
    },
  });
