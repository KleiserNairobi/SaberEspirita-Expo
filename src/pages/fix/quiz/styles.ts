import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.accent,
    },
    headerTitle: {
      ...theme.text("lg", "bold"),
      color: theme.colors.text,
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    questionContainer: {
      marginBottom: theme.spacing.lg,
    },
    questionText: {
      ...theme.text("lg", "medium"),
      color: theme.colors.text,
      lineHeight: 28,
    },
    footer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
    },
    // Bottom Sheet Styles
    bottomSheetContent: {
      padding: theme.spacing.xl,
      alignItems: "center",
    },
    sheetTitle: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    sheetSubtitle: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    sheetButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
      width: "100%",
    },
    sheetButton: {
      flex: 1,
    },
  });
}
