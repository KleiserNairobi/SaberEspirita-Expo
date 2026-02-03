import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      justifyContent: "space-between",
    },
    contentWrapper: {
      alignItems: "center",
    },
    imageContainer: {
      marginBottom: theme.spacing.md,
      alignItems: "center",
    },
    kardecImage: {
      width: 130,
      height: 173,
      borderRadius: theme.radius.lg,
    },
    titleContainer: {
      marginBottom: theme.spacing.md,
      alignItems: "center",
    },
    titleFirstLine: {
      fontFamily: "Baskervville_400Regular_Italic",
      fontSize: 22,
      textAlign: "center",
      color: theme.colors.text,
    },
    titleSecondLine: {
      fontFamily: "Allura_400Regular",
      fontSize: 48,
      textAlign: "center",
      color: theme.colors.text,
      textShadowColor: "rgba(0, 0, 0, 0.15)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    bodyContainer: {
      marginBottom: theme.spacing.lg,
    },
    bodyText: {
      ...theme.text("md", "regular"),
      textAlign: "justify",
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    quoteContainer: {
      backgroundColor: theme.colors.card,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginTop: theme.spacing.md,
    },
    quoteText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      lineHeight: 18,
      marginBottom: theme.spacing.xs,
    },
    quoteAuthor: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
      textAlign: "left",
    },
    buttonContainer: {
      width: "100%",
      // marginTop: 10,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.onPrimary,
    },
  });
