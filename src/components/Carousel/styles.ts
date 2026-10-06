import { Dimensions, StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

const { width } = Dimensions.get("window");

export const SPACING = 8;
// Proporção retrato refinada (largura 56% da tela para presença visual harmônica)
export const ITEM_SIZE = width * 0.56;
export const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    itemContainer: {
      marginHorizontal: SPACING,
      borderRadius: 16,
      overflow: "hidden",
    },
    imageContainer: {
      width: "100%",
      height: 195, // Altura reduzida em ~20% sobre o original, mantendo proporção vertical
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
    },
    imageView: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
    },
    textOverlayContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      paddingHorizontal: 12,
      paddingBottom: 16,
    },
    title: {
      ...theme.text("md", "bold"),
      fontSize: 16,
      lineHeight: 21,
      color: "#FFFFFF",
      textShadowColor: "rgba(0, 0, 0, 0.85)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    progressBarContainer: {
      width: "100%",
      height: 4,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      borderRadius: 2,
      marginTop: 8,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    percentText: {
      position: "absolute",
      right: 0,
      top: -14,
      fontFamily: "BarlowCondensed_600SemiBold",
      fontSize: 10,
      color: "#FFF",
      textShadowColor: "rgba(0,0,0,0.8)",
      textShadowRadius: 2,
    },
    ratingBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 10,
    },
    ratingBadgeStar: {
      color: "#FFD700",
      fontSize: 10,
      marginRight: 2,
    },
    ratingBadgeText: {
      fontFamily: "BarlowCondensed_600SemiBold",
      fontSize: 11,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    rankBadge: {
      position: "absolute",
      top: 12,
      left: 16,
      zIndex: 10,
    },
    rankBadgeText: {
      fontFamily: "Oswald_700Bold",
      fontSize: 26,
      lineHeight: 30,
      color: "#FFFFFF",
      textShadowColor: "rgba(0, 0, 0, 0.85)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    comingSoonBadge: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: theme.colors.warning,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      zIndex: 10,
    },
    comingSoonBadgeText: {
      fontFamily: "BarlowCondensed_600SemiBold",
      fontSize: 10,
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
  });
