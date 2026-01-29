import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    containerOutline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.muted,
    },
    containerFullWidth: {
      width: "100%",
    },
    containerDisabled: {
      opacity: 0.5,
    },
    text: {
      ...theme.text("md", "semibold"),
      color: "white",
    },
    textOutline: {
      color: theme.colors.text,
    },
    textDisabled: {
      color: theme.colors.muted,
    },
  });
}
