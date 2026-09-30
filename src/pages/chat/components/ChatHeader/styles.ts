import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginLeft: 12,
    },
    actionButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: `${theme.colors.primary}12`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}25`,
      alignItems: "center",
      justifyContent: "center",
    },
  });
