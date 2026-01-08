import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    containerSuccess: {
      backgroundColor: `${theme.colors.success}20`,
      borderColor: theme.colors.success,
    },
    containerError: {
      backgroundColor: `${theme.colors.error}20`,
      borderColor: theme.colors.error,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    text: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      flex: 1,
    },
    textChecked: {
      ...theme.text("md", "regular"),
    },
    iconContainer: {
      marginLeft: theme.spacing.sm,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  });
}
