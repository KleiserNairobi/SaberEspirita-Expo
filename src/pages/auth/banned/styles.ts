import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.xl || 24,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(239, 68, 68, 0.1)", // Red alert background soft opacity
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg || 16,
    },
    title: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md || 12,
    },
    message: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: theme.spacing.xl || 24,
    },
    detailsCard: {
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: theme.radius.md || 8,
      padding: theme.spacing.md || 12,
      width: "100%",
      marginBottom: theme.spacing.xl || 24,
      borderWidth: 1,
      borderColor: "transparent",
    },
    detailsTitle: {
      ...theme.text("xs", "bold"),
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: theme.spacing.xs || 6,
    },
    detailsText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      fontFamily: "Courier", // Monospace para parecer um ID/código de segurança
    },
    button: {
      width: "100%",
    },
  });
}
