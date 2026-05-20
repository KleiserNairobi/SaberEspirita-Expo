import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      justifyContent: "center",
      alignItems: "center",
    },
    emoji: {
      fontSize: 72,
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.text("xxl", "bold"),
      textAlign: "center",
      marginBottom: theme.spacing.md,
      color: theme.colors.text,
    },
    body: {
      ...theme.text("lg", "regular", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    buttonContainer: {
      width: "100%",
      gap: theme.spacing.md,
    },
  });

