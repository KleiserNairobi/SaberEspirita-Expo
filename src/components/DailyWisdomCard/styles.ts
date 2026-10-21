import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md + 4,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md + 8,
      paddingBottom: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}12`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}40`,
      borderRadius: theme.radius.sm,
    },
    badge: {
      position: "absolute",
      top: -12,
      left: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}50`,
    },
    badgeText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    topActions: {
      position: "absolute",
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 2,
    },
    readFullButton: {
      width: 32,
      height: 32,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${theme.colors.primary}18`,
    },
    title: {
      ...theme.text("md", "semibold", theme.colors.text),
      marginBottom: 2,
      paddingRight: 36, // Espaço para não colidir com o readFullButton
    },
    referenceRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    referenceText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    dividerDot: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    authorText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    quoteContainer: {
      backgroundColor: `${theme.colors.background}80`,
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: theme.spacing.xs + 3,
      borderRadius: theme.radius.xs,
      marginBottom: theme.spacing.sm,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.primary,
    },
    quoteText: {
      fontFamily: "Baskervville_400Regular_Italic",
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text,
    },
    contentSnippet: {
      ...theme.text("md", "regular", theme.colors.text),
      lineHeight: 22,
      marginBottom: theme.spacing.md,
      opacity: 0.9,
    },
    moodPromptContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm + 2,
      backgroundColor: `${theme.colors.primary}08`,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}20`,
      marginBottom: 0,
    },
    moodPromptLabel: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    moodPromptButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    moodPromptButtonText: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
  });
