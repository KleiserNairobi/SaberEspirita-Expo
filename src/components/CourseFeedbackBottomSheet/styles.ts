import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    contentContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      paddingVertical: 16,
    },
    starsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      marginBottom: 8,
    },
    starButton: {
      padding: 4,
    },
    ratingLabel: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: 20,
    },
    inputContainer: {
      width: "100%",
    },
    textInput: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      ...theme.text("md", "regular", theme.colors.text),
      minHeight: 100,
      textAlignVertical: "top", // Apenas Android
    },
  });
};
