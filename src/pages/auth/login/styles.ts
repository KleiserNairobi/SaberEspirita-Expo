import { StyleSheet, Platform } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5", // Fundo claro off-white
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
      marginBottom: theme.spacing.lg,
    },
    logoText: {
      ...theme.text("xxxl", "bold"),
      fontStyle: "italic",
      textAlign: "center",
      color: "#1A1A1A", // Texto escuro
    },
    premiumText: {
      ...theme.text("sm", "regular"),
      textAlign: "center",
      color: "#6B6B6B", // Cinza médio
      marginTop: theme.spacing.xs,
    },
    welcomeTitle: {
      ...theme.text("xxl", "bold"),
      textAlign: "left",
      color: "#1A1A1A",
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.text("md", "regular"),
      textAlign: "left",
      color: "#6B6B6B",
      marginBottom: theme.spacing.xl,
      lineHeight: 22,
    },
    inputWrapper: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      ...theme.text("sm", "medium"),
      color: "#1A1A1A",
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF", // Branco puro
      borderRadius: 16, // Bordas bem arredondadas
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 2, // ~14px
      gap: theme.spacing.sm,
      // Sombra sutil
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    input: {
      flex: 1,
      ...theme.text("md", "regular"),
      color: "#1A1A1A",
      padding: 0,
      margin: 0,
    },
    eyeButton: {
      padding: theme.spacing.xs,
    },
    errorText: {
      ...theme.text("sm", "regular"),
      color: "#D32F2F",
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
    buttonContainer: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    secondaryButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
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
      ...theme.text("sm", "medium"),
      color: theme.colors.primary,
    },
  });
}
