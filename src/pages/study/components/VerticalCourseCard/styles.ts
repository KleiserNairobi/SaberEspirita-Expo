import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}18`,
      overflow: "hidden",
    },
    imageWrapper: {
      width: "100%",
      aspectRatio: 1.25,
      backgroundColor: `${theme.colors.primary}10`,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    comingSoonBadge: {
      position: "absolute",
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      backgroundColor: theme.colors.warning,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.xs,
      zIndex: 2,
    },
    comingSoonText: {
      ...theme.text("xs", "semibold", theme.colors.onPrimary),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    premiumBadge: {
      position: "absolute",
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      backgroundColor: "rgba(0, 0, 0, 0.70)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.xs,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      zIndex: 2,
    },
    premiumBadgeText: {
      ...theme.text("xs", "semibold", theme.colors.warning),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    imageGradientOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "62%",
      justifyContent: "flex-end",
      paddingHorizontal: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      zIndex: 1,
    },
    imageTitle: {
      ...theme.text("sm", "semibold", theme.colors.onPrimary),
      lineHeight: 18,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.card,
    },
    levelText: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      textTransform: "capitalize",
    },
    ratingBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    ratingText: {
      ...theme.text("xs", "semibold", theme.colors.text),
    },
  });
