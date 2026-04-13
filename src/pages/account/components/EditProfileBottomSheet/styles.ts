import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      padding: 24,
      gap: 24,
    },
    title: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    description: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: 16,
    },
    inputContainer: {
      gap: 8,
    },
    label: {
      ...theme.text("sm", "semibold", theme.colors.textSecondary),
      marginLeft: 4,
    },
    input: {
      height: 56,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.text("md", "regular", theme.colors.text),
    },
    actions: {
      gap: 12,
      marginTop: 8,
    },
  });
}
