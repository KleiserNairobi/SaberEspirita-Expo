import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
    },
    modalContent: {
      paddingHorizontal: 24,
      paddingTop: 8,
    },
    modalHeader: {
      marginBottom: 20,
    },
    modalTitle: {
      ...theme.text("xl", "semibold", theme.colors.text),
    },
    moodList: {
      // Aberto para altura dinâmica total
    },
    moodOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      gap: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    moodOptionSelected: {
      // Estilo de selecionado se necessário
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
      flex: 1,
      ...theme.text("md", "medium", theme.colors.text),
    },
    optionLabelSelected: {
      ...theme.text("md", "semibold", theme.colors.text),
    },
    selectionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.success || "#5C8A5C",
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: 12,
      gap: 8,
    },
    clearButtonText: {
      ...theme.text("md", "medium", theme.colors.textSecondary),
    },
  });
