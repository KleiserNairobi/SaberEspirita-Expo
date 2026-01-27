import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    textColumn: {
      flex: 1,
    },
    title: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    description: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    actionButton: {
      marginTop: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: theme.radius.md,
      backgroundColor: `${theme.colors.primary}20`, // Verde claro (20% opacity)
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "stretch", // 100% da largura
    },
    actionText: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.primary, // Verde
      letterSpacing: 0.5,
    },
  });
