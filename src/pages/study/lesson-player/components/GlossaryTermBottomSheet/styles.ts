import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    titleGroup: {
      flex: 1,
    },
    categoryLabel: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.primary,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    termTitle: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
    },
    definitionScroll: {
      flex: 1,
      marginBottom: theme.spacing.md,
    },
    definitionText: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      lineHeight: 24,
      textAlign: "justify",
    },
    buttonContainer: {
      marginTop: "auto",
      width: "100%",
      gap: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
  });
