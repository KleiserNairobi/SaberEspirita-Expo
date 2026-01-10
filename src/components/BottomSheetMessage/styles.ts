import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
      width: 40,
      height: 4,
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 24,
      alignItems: "center",
    },
    iconContainer: {
      marginTop: 16,
      marginBottom: 24,
    },
    title: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    message: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
    },
    buttonContainer: {
      width: "100%",
      gap: 12,
      marginTop: "auto",
    },
  });
