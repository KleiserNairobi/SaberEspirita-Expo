import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    slideCard: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    slideTitle: {
      ...theme.text("xl", "bold"),
      marginBottom: theme.spacing.md,
    },
  });
