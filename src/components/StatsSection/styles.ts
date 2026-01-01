import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    title: {
      ...theme.text("xxl", "regular"),
    },
    grid: {
      gap: theme.spacing.sm,
    },
    row: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    card: {
      flex: 1,
    },
  });
