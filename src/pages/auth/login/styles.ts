import { StyleSheet, Platform } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xxl,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      alignItems: "center",
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    logoText: {
      fontFamily: "Allura_400Regular",
      fontSize: 60,
      textAlign: "center",
      color: theme.colors.text,
      textShadowColor: "rgba(0, 0, 0, 0.15)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    welcomeTitle: {
      ...theme.text("xxl", "medium"),
      textAlign: "left",
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.text("md", "regular"),
      textAlign: "left",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      lineHeight: 22,
    },
    inputWrapper: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      ...theme.text("sm", "medium"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      paddingHorizontal: theme.spacing.md,
      height: 44,
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 1.2,
    },
    inputContainerError: {
      borderColor: theme.colors.error,
    },
    input: {
      flex: 1,
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      padding: 0,
      margin: 0,
    },
    eyeButton: {
      padding: theme.spacing.xs,
    },
    errorText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
    buttonContainer: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    secondaryButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    secondaryButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      padding: theme.spacing.xs,
    },
    secondaryButtonText: {
      ...theme.text("md", "medium"),
      color: theme.colors.primary,
    },
  });
}
