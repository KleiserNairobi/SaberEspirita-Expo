import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    card: {
      width: "100%",
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      overflow: "hidden",
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    cardPortraitTablet: {
      maxWidth: 440,
      alignSelf: "center",
    },
    imageFrame: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    errorContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    errorText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
      textAlign: "center",
    },
    retryButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 2,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    retryButtonText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    expandBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      backgroundColor: `${theme.colors.primary}0D`,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    expandBarText: {
      ...theme.text("xs", "medium", theme.colors.primary),
    },
    captionContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    captionText: {
      ...theme.readingText(14, "italic", theme.colors.textSecondary, 20),
      textAlign: "left",
    },
    lightboxRoot: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.94)",
    },
    lightboxHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    lightboxCloseButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      justifyContent: "center",
      alignItems: "center",
    },
    lightboxBody: {
      flex: 1,
    },
    lightboxFooter: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      gap: theme.spacing.xs,
      alignItems: "center",
    },
    lightboxCaption: {
      ...theme.readingText(14, "italic", "rgba(255, 255, 255, 0.88)", 20),
      textAlign: "center",
    },
    lightboxHintRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    lightboxHintText: {
      ...theme.text("xs", "medium", "rgba(255, 255, 255, 0.72)"),
    },
  });
