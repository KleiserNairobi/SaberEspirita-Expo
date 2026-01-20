import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    text: {
      ...theme.text("sm", "regular"),
      color: "#6B6B6B", // Cinza médio para tema claro
      textAlign: "center",
    },
    link: {
      ...theme.text("sm", "medium"),
      color: theme.colors.primary, // Verde oliva
      textDecorationLine: "underline",
    },
  });
}
