import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      borderWidth: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "semibold"),
      marginBottom: 2,
    },
    subtitle: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
  });
