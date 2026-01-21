import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    linksContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      ...theme.text("md", "regular"),
      color: "#6B6B6B", // Cinza médio para tema claro
      textAlign: "center",
    },
    link: {
      ...theme.text("md", "medium"),
      color: theme.colors.primary,
      textDecorationLine: "underline",
    },
  });
}
