import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 150,
    },
    header: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.readingText("xxl", "semibold"),
      marginBottom: theme.spacing.xs,
      textAlign: "left",
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.text("lg", "regular", theme.colors.textSecondary),
      textAlign: "left",
      marginBottom: theme.spacing.xs,
    },
    signatureContainer: {
      marginTop: theme.spacing.xl,
      alignItems: "flex-start",
      paddingTop: theme.spacing.sm,
      gap: 3,
    },
    signatureAuthor: {
      ...theme.literaryText(15, theme.colors.textSecondary),
      textAlign: "left",
    },
    signatureSource: {
      ...theme.literaryText(13, theme.colors.textSecondary),
      opacity: 0.85,
      textAlign: "left",
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 30,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 10,
    },
    bodyText: {
      ...theme.readingText("md", "regular"),
      color: theme.colors.text,
      textAlign: "left",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 24,
    },
    tag: {
      backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.radius.full,
    },
    tagText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      ...theme.text("md", "regular"),
      color: theme.colors.muted,
      textAlign: "center",
    },
    finishButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    finishButtonText: {
      ...theme.text("md", "semibold", theme.colors.background),
      textTransform: "uppercase",
    },
    fixedFooter: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.md,
    },
  });
