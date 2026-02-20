import { ITheme } from "@/configs/theme/types";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundGlow: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.card,
      opacity: 0.5,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 30,
    },
    coverArtContainer: {
      width: width * 0.75,
      height: width * 0.75,
      borderRadius: theme.radius.xl,
      overflow: "hidden",
      marginBottom: 40,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    coverArt: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.border,
    },
    infoContainer: {
      alignItems: "center",
      marginBottom: 40,
      width: "100%",
    },
    title: {
      ...theme.text("xxl", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    author: {
      ...theme.text("md", "regular"),
      color: theme.colors.primary,
      textAlign: "center",
      fontFamily: "Oswald_400Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    progressContainer: {
      width: "100%",
      marginBottom: 40,
    },
    progressBarBackground: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    timeText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
    },
    controlsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
    },
    playButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    secondaryControl: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
  });
