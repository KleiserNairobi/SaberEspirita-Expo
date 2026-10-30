import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    contentWrapper: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    logo: {
      width: 104,
      height: 104,
    },
    title: {
      fontFamily: "Allura_400Regular",
      fontSize: 52,
      textAlign: "center",
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      lineHeight: 58,
    },
    motto: {
      ...theme.literaryText(16, theme.colors.textSecondary),
      textAlign: "center",
      marginTop: theme.spacing.xs,
      letterSpacing: 0.3,
      paddingHorizontal: theme.spacing.md,
    },
    indicatorContainer: {
      marginTop: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    progressTrack: {
      width: 130,
      height: 3,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}25`,
      overflow: "hidden",
    },
    progressBar: {
      width: 50,
      height: 3,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
    },
  });
}
