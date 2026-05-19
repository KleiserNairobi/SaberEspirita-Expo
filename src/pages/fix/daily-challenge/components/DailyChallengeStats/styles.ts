import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    grid: {
      gap: theme.spacing.md,
    },
    row: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    card: {
      flex: 1,
    },
  });
