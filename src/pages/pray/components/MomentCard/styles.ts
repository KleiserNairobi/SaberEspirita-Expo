import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginRight: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 100,
    },
    icon: {
      marginBottom: theme.spacing.xs,
    },
    label: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      textAlign: "center",
    },
  });
