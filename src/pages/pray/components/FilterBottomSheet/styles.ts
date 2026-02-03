import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.background,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    title: {
      ...theme.text("xl", "semibold"),
      marginBottom: theme.spacing.md,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
    },
    optionSelected: {
      // Sem mudança visual de fundo
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    optionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    optionIconContainerSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionLabel: {
      ...theme.text("md", "regular"),
    },
    optionLabelSelected: {
      fontFamily: theme.typography.weights.semibold,
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
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}20`, // 20% opacity - verde claro
      borderRadius: theme.radius.md,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    clearButtonIcon: {
      marginRight: theme.spacing.sm,
    },
    clearButtonText: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
  });
