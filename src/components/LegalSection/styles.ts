import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) => {
  const viewStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    } as ViewStyle,
    first: {
      marginTop: theme.spacing.lg,
    } as ViewStyle,
    last: {
      marginBottom: theme.spacing.xl,
    } as ViewStyle,
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    } as ViewStyle,
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    headerText: {
      flex: 1,
    } as ViewStyle,
    contentWrapper: {
      overflow: "hidden",
    } as ViewStyle,
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      paddingTop: 0,
    } as ViewStyle,
  });

  const textStyles = StyleSheet.create({
    title: {
      ...theme.text("lg", "semibold"),
      marginBottom: theme.spacing.xs,
    } as TextStyle,
    summary: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    } as TextStyle,
    contentText: {
      ...theme.text("md", "regular"),
      lineHeight: 24,
    } as TextStyle,
  });

  return { ...viewStyles, ...textStyles };
};
