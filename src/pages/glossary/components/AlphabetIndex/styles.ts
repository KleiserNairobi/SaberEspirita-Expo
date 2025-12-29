import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      paddingRight: theme.spacing.xs,
      zIndex: 10,
    },
    letterButton: {
      paddingVertical: 2,
      paddingHorizontal: theme.spacing.xs,
    },
    letter: {
      ...theme.text("xs", "medium"),
      color: theme.colors.primary,
    },
  });
}
