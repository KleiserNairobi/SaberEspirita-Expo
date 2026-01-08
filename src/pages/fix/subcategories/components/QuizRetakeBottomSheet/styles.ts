import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      alignItems: "center",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    buttonContainer: {
      width: "100%",
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    buttonWrapper: {
      flex: 1,
    },
  });
