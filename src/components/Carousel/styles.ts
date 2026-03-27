import { Dimensions, StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

const { width } = Dimensions.get("window");

export const SPACING = 10;
export const ITEM_SIZE = width * 0.72;
export const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    itemContainer: {
      marginHorizontal: SPACING,
      borderRadius: 24,
      overflow: "hidden",
    },
    imageContainer: {
      width: "100%",
      height: 240,
      borderRadius: 16,
      overflow: "hidden",
      alignSelf: "center",
    },
    imageView: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    textOverlayContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      padding: SPACING * 2,
    },
    title: {
      fontFamily: "Oswald_300Light",
      fontSize: 20,
      marginBottom: 5,
      color: "white",
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    description: {
      fontFamily: "Oswald_300Light",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: 16,
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    progressBarContainer: {
      width: "100%",
      height: 6,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 3,
      marginTop: 10,
      marginBottom: 12, // Espaço antes do botão
      flexDirection: "row",
      alignItems: "center",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: "#FFF",
      borderRadius: 3,
    },
    percentText: {
      position: "absolute",
      right: 0,
      top: -18,
      fontFamily: "BarlowCondensed_600SemiBold",
      fontSize: 12,
      color: "#FFF",
      textShadowColor: "rgba(0,0,0,0.8)",
      textShadowRadius: 2,
    },
    button: {
      alignSelf: "stretch",
      backgroundColor: theme.colors.primary + "CC", // 80% opacidade
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 0,
      marginTop: 4,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonComingSoon: {
      backgroundColor: theme.colors.warning + "CC", // 80% opacidade
      opacity: 1,
    },
    buttonCompleted: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderWidth: 0,
    },
    buttonContinuing: {
      backgroundColor: theme.colors.primary + "CC", // 80% opacidade
      borderWidth: 0,
    },
    buttonDisabled: {
      opacity: 0.5,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    buttonText: {
      fontFamily: "Oswald_600SemiBold",
      fontSize: 14,
      color: "#FFFFFF",
      letterSpacing: 0.8,
      textAlign: "center",
      textTransform: "uppercase",
    },
  });
