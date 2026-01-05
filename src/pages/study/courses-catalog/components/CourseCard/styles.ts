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
      minHeight: 130, // Restaurado minHeight para consistência
    },
    imagePlaceholder: {
      width: 100,
      // height removido: Flexbox (alignItems: stretch) do pai cuidará da altura
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
      gap: 6,
      marginBottom: theme.spacing.xs,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metadataText: {
      ...theme.text("xs", "regular", theme.colors.muted),
      fontSize: 11,
    },
    metadataSeparator: {
      ...theme.text("xs", "regular", theme.colors.muted),
      fontSize: 11,
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
      fontSize: 10,
      marginTop: 2,
    },
  });
