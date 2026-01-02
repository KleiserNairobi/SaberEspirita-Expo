import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      padding: theme.spacing.md, // 16px
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm, // 12px
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },
    textContainer: {
      gap: 4,
    },
    label: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
    },
    value: {
      ...theme.text("xl", "medium"),
    },
  });
