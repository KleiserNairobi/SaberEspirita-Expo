import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    } as ViewStyle,
    levelItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.md,
    } as ViewStyle,
    levelItemCurrent: {
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 0,
      marginVertical: theme.spacing.xs,
    } as ViewStyle,
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    iconContainerCurrent: {
      backgroundColor: theme.colors.primary + "20",
      borderColor: theme.colors.primary,
    } as ViewStyle,
    iconContainerPast: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.primary,
    } as ViewStyle,
    textContainer: {
      flex: 1,
    } as ViewStyle,
    levelTitle: {
      fontFamily: theme.typography.weights.bold,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    } as TextStyle,
    levelTitleActive: {
      color: theme.colors.text,
    } as TextStyle,
    levelDescription: {
      fontFamily: theme.typography.weights.regular,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    } as TextStyle,
    levelRules: {
      fontFamily: theme.typography.weights.regular,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    } as TextStyle,
  });
