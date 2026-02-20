import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginBottom: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    premiumBorder: {
      borderColor: theme.colors.accent,
      borderWidth: 1.5,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    description: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.primary,
      marginLeft: 4,
      fontFamily: "Oswald_400Regular",
      textTransform: "uppercase",
    },
    actionContainer: {
      marginLeft: 10,
      justifyContent: "center",
      alignItems: "center",
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.background,
    },
  });
