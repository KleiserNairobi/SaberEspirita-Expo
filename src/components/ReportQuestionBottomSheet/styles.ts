import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      paddingTop: 8,
      gap: 20,
    },
    title: {
      ...theme.text("xl", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 2,
    },
    sectionTitle: {
      ...theme.text("sm", "semibold", theme.colors.textSecondary),
      marginBottom: -4,
      marginLeft: 4,
    },
    optionsList: {
      gap: 10,
    },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "0A", // 4% de opacidade da cor primária
    },
    optionText: {
      flex: 1,
      ...theme.text("md", "regular", theme.colors.text),
    },
    optionTextSelected: {
      ...theme.text("md", "semibold", theme.colors.primary),
    },
    radioCircle: {
      height: 18,
      width: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    radioCircleSelected: {
      borderColor: theme.colors.primary,
    },
    radioDot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    inputContainer: {
      gap: 8,
      marginTop: 4,
    },
    label: {
      ...theme.text("sm", "semibold", theme.colors.textSecondary),
      marginLeft: 4,
    },
    input: {
      minHeight: 64,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.text("md", "regular", theme.colors.text),
      textAlignVertical: "top",
    },
    actions: {
      gap: 12,
      marginTop: 8,
    },
    successContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
      gap: 16,
    },
    successTitle: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
    },
    successSubtitle: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
      lineHeight: 20,
    },
  });
}
