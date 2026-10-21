import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      marginBottom: 20,
      marginHorizontal: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    labelSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}10`,
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      flex: 1,
      gap: 2,
    },
    title: {
      ...theme.text("md", "medium", theme.colors.text),
    },
    description: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: `${theme.colors.primary}10`,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}20`,
    },
    selectorButtonText: {
      ...theme.text("xs", "semibold", theme.colors.textSecondary),
    },
    // Bottom Sheet Styles
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
    },
    handleIndicator: {
      backgroundColor: `${theme.colors.textSecondary}40`,
      width: 40,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.primary}15`,
    },
    headerTextBlock: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    modalTitle: {
      ...theme.text("md", "bold", theme.colors.text),
    },
    modalSubtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    moodOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}08`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}25`,
      borderRadius: theme.radius.sm,
      gap: theme.spacing.md,
    },
    moodOptionSelected: {
      backgroundColor: `${theme.colors.primary}18`,
      borderColor: theme.colors.primary,
    },
    optionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    optionIconContainerSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      ...theme.text("sm", "semibold", theme.colors.text),
      marginBottom: 2,
    },
    optionLabelSelected: {
      color: theme.colors.primary,
    },
    optionSubtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      lineHeight: 16,
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    clearButtonText: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
  });
