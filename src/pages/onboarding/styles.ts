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
      justifyContent: "space-between",
      paddingBottom: theme.spacing.xl,
    },
    welcomeWrapper: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      alignItems: "center",
    },
    imageContainer: {
      width: 140,
      height: 170,
      borderRadius: theme.radius.lg,
      overflow: "hidden",
      marginBottom: theme.spacing.md,
    },
    kardecImage: {
      width: "100%",
      height: "100%",
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    titleFirstLine: {
      ...theme.text("lg", "medium", theme.colors.textSecondary),
      fontStyle: "italic",
    },
    titleSecondLine: {
      ...theme.text("xxl", "bold", theme.colors.text),
      fontFamily: "Allura_400Regular",
      fontSize: 48,
      lineHeight: 56,
      textAlign: "center",
    },
    bodyContainer: {
      width: "100%",
    },
    bodyText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "justify",
      lineHeight: 24,
      marginBottom: theme.spacing.sm,
    },
    quoteContainer: {
      backgroundColor: `${theme.colors.primary}10`,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.radius.sm,
      marginTop: theme.spacing.sm,
      elevation: 0,
    },
    quoteText: {
      ...theme.text("sm", "regular", theme.colors.text),
      fontFamily: "Baskervville_400Regular_Italic",
      lineHeight: 20,
      marginBottom: theme.spacing.xs,
    },
    quoteAuthor: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      textAlign: "right",
    },
    buttonContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    secondaryButtonText: {
      ...theme.text("md", "regular", theme.colors.text),
    },
    questionScrollContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing.xxl,
    },
    stepContainer: {
      flex: 1,
      paddingTop: theme.spacing.sm,
    },
    questionHeader: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    stepBadge: {
      ...theme.text("xs", "bold", theme.colors.primary),
      letterSpacing: 1.2,
      marginBottom: theme.spacing.xs,
    },
    questionTitle: {
      ...theme.text("xl", "semibold", theme.colors.text),
      lineHeight: 28,
      marginBottom: theme.spacing.xs,
    },
    questionSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      lineHeight: 20,
    },
    optionsList: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    transitionContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xl,
    },
    transitionIconWrapper: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    transitionTitle: {
      ...theme.text("xl", "bold", theme.colors.text),
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    transitionSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
      lineHeight: 22,
      marginBottom: theme.spacing.xl,
    },
    spinner: {
      marginTop: theme.spacing.md,
    },
  });
