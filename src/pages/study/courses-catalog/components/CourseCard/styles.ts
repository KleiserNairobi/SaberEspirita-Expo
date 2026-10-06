import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
      overflow: "hidden",
      minHeight: 130,
    },
    imagePlaceholder: {
      width: 100,
      backgroundColor: theme.colors.accent,
      justifyContent: "center",
      alignItems: "center",
    },
    courseImage: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
      justifyContent: "space-between",
    },
    topContent: {
      flex: 1,
    },
    title: {
      ...theme.text("md", "semibold"),
      marginBottom: theme.spacing.xs,
      lineHeight: 20,
    },
    description: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginBottom: theme.spacing.sm,
      lineHeight: 16,
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metadataText: {
      ...theme.text("xs", "regular", theme.colors.muted),
    },
    metadataSeparator: {
      ...theme.text("xs", "regular", theme.colors.muted),
    },
    progressContainer: {
      marginTop: theme.spacing.xs,
    },
    progressBar: {
      height: 3,
      backgroundColor: theme.colors.border,
      borderRadius: theme.radius.xs,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
    },
    progressText: {
      ...theme.text("xs", "regular", theme.colors.primary),
      marginTop: theme.spacing.xs / 2,
    },
    cardDisabled: {
      opacity: 0.6,
    },
    comingSoonBadge: {
      position: "absolute",
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },
    comingSoonText: {
      ...theme.text("xs", "semibold", theme.colors.onPrimary),
      letterSpacing: 0.5,
    },
    comingSoonBadgeLarge: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.warning,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      marginTop: theme.spacing.xs,
    },
    comingSoonTextLarge: {
      ...theme.text("sm", "semibold", theme.colors.onPrimary),
      letterSpacing: 0.8,
    },
  });
