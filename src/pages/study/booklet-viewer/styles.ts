import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    backButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.background,
    },
    headerTitleContainer: {
      flex: 1,
      marginHorizontal: theme.spacing.sm,
      alignItems: "center",
    },
    headerTitle: {
      ...theme.text("md", "bold"),
      color: theme.colors.text,
      textAlign: "center",
    },
    headerSubtitle: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
    pageBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.radius.xs,
      backgroundColor: `${theme.colors.primary}18`,
      minWidth: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    pageBadgeText: {
      ...theme.text("xs", "bold", theme.colors.primary),
      fontFamily: "Oswald_400Regular",
    },
    headerRightPlaceholder: {
      width: 48,
    },
    pdfContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      position: "relative",
    },
    pdf: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.background,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      zIndex: 10,
    },
    loadingText: {
      marginTop: theme.spacing.sm,
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    errorText: {
      ...theme.text("md", "medium"),
      color: theme.colors.error,
      textAlign: "center",
      maxWidth: 280,
    },
    retryButton: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
    },
    retryButtonText: {
      ...theme.text("sm", "bold"),
      color: theme.colors.background,
    },
  });
