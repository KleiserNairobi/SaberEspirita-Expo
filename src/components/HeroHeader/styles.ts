import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    coverImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 280,
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 280,
      backgroundColor: "rgba(0,0,0,0.25)",
    },
    staticTitleContainer: {
      height: 248,
      justifyContent: "flex-end",
      paddingHorizontal: theme.spacing.md,
      paddingBottom: 44,
    },
    imageTitleSection: {
      alignSelf: "stretch",
    },
    imageCourseTitle: {
      marginBottom: 4,
      ...theme.text("xxl", "bold"),
      color: theme.colors.onSecondary,
      fontFamily: "Oswald_600SemiBold",
      lineHeight: 32,
      textShadowColor: "rgba(0, 0, 0, 0.6)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    imageCourseSubtitle: {
      ...theme.text("md", "regular"),
      color: "rgba(255, 255, 255, 0.8)",
      fontFamily: "Oswald_400Regular",
      letterSpacing: 0.5,
      textShadowColor: "rgba(0, 0, 0, 0.6)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    floatingHeader: {
      position: "absolute",
      left: theme.spacing.md,
      right: theme.spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 100,
    },
    floatingBackButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    floatingShareButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
  });
