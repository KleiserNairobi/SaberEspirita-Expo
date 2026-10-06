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
      top: 6,
      left: 6,
      backgroundColor: theme.colors.warning,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      zIndex: 2,
    },
    comingSoonText: {
      ...theme.text("xs", "semibold", "#FFFFFF"),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    premiumBadge: {
      position: "absolute",
      top: 6,
      left: 6,
      backgroundColor: "rgba(0, 0, 0, 0.70)",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      zIndex: 2,
    },
    premiumBadgeText: {
      ...theme.text("xs", "semibold", "#FFD700"),
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
      paddingHorizontal: 8,
      paddingBottom: 8,
      zIndex: 1,
    },
    imageTitle: {
      ...theme.text("sm", "semibold", "#FFFFFF"),
      lineHeight: 18,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingVertical: 6,
      backgroundColor: theme.colors.card,
    },
    levelText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      textTransform: "capitalize",
    },
    ratingBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    ratingText: {
      ...theme.text("xs", "semibold", theme.colors.text),
    },
  });
