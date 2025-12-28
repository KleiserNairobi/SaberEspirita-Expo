import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

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
    content: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: 6,
      lineHeight: 18,
    },
    metaContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    favoriteIcon: {
      marginRight: 6,
    },
    metaText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.muted,
      flex: 1,
    },
  });
