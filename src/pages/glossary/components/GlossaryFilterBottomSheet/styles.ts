import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
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
    },
    title: {
      ...theme.text("xl", "semibold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
    },
    optionSelected: {
      // Sem estilo especial de fundo
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    optionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    optionIconContainerSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionLabel: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      flex: 1,
    },
    optionLabelSelected: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
    },
    selectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.xs,
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.background,
      marginTop: theme.spacing.md,
    },
    clearButtonIcon: {
      marginRight: theme.spacing.sm,
    },
    clearButtonText: {
      ...theme.text("md", "medium"),
      color: theme.colors.primary,
    },
  });
}
