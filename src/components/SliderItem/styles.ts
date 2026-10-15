import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    background: {
      position: "absolute",
      width: 280,
      height: 400,
      borderRadius: theme.radius.md,
      padding: theme.spacing.lg,
      justifyContent: "space-between",
    },
    icon: {
      padding: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    title: {
      ...theme.text("xxl", "bold", theme.colors.onPrimary),
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    description: {
      ...theme.text("lg", "regular", theme.colors.onPrimary),
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });
