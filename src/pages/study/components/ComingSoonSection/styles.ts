import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      ...theme.text("xl", "regular"),
    },
    counterText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    card: {
      height: 148,
      borderRadius: theme.radius.md,
      overflow: "hidden",
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      position: "relative",
    },
    bgImage: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
      padding: theme.spacing.md,
      justifyContent: "space-between",
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    comingSoonBadge: {
      backgroundColor: theme.colors.warning,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.xs,
    },
    comingSoonText: {
      ...theme.text("xs", "semibold", theme.colors.onSecondary),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    categoryPill: {
      ...theme.text("xs", "medium", "rgba(255, 255, 255, 0.9)"),
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.xs,
    },
    bottomContent: {
      gap: 2,
    },
    courseTitle: {
      ...theme.text("lg", "semibold", "#FFFFFF"),
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    authorText: {
      ...theme.text("xs", "regular", "rgba(255, 255, 255, 0.85)"),
    },
    ctaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      marginTop: 4,
    },
    ctaText: {
      ...theme.text("xs", "medium", theme.colors.primary),
    },
  });
