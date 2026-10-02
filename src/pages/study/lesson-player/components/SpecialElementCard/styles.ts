import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme, accentColor: string, fontSize: number = 16) =>
  StyleSheet.create({
    container: {
      position: "relative",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md + 6,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md + 6,
      paddingBottom: theme.spacing.md,
      backgroundColor: `${accentColor}12`,
      borderWidth: 1,
      borderColor: `${accentColor}40`,
      borderRadius: theme.radius.sm,
    },
    header: {
      position: "absolute",
      top: -12,
      left: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: `${accentColor}50`,
    },
    headerTitle: {
      ...theme.text("xs", "semibold"),
      color: accentColor,
      fontSize: 12,
    },
    content: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      fontSize: fontSize,
      lineHeight: fontSize * 1.5,
      textAlign: "justify",
      opacity: 0.95,
    },
  });
